import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const OWNER_EMAIL = 'mh9456605@gmail.com';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (email !== OWNER_EMAIL || !/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Invalid or expired code.' });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const otpSecret = process.env.OTP_HMAC_SECRET;
  if (!url || !serviceKey || !otpSecret || otpSecret.length < 32) return res.status(503).json({ error: 'Password recovery is temporarily unavailable.' });

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const { data: row, error } = await supabase.from('password_reset_otps')
      .select('id, otp_hash, attempt_count')
      .eq('email', OWNER_EMAIL).eq('used', false).gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (error || !row) return res.status(400).json({ error: 'Invalid or expired code.' });

    const candidate = crypto.createHmac('sha256', otpSecret).update(`${OWNER_EMAIL}:${code}`).digest();
    const expected = Buffer.from(row.otp_hash, 'hex');
    const valid = candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
    if (!valid) {
      const { error: attemptError } = await supabase.rpc('record_password_reset_attempt', { p_id: row.id });
      if (attemptError) throw attemptError;
      return res.status(400).json({ error: 'Invalid or expired code.' });
    }

    const { data: consumed, error: consumeError } = await supabase.from('password_reset_otps')
      .update({ used: true }).eq('id', row.id).eq('used', false).select('id').maybeSingle();
    if (consumeError || !consumed) return res.status(400).json({ error: 'Invalid or expired code.' });

    const expires = Date.now() + 5 * 60_000;
    const nonce = crypto.randomBytes(16).toString('hex');
    const claims = Buffer.from(JSON.stringify({ email: OWNER_EMAIL, expires, nonce })).toString('base64url');
    const signature = crypto.createHmac('sha256', otpSecret).update(claims).digest('base64url');
    const recoveryToken = `${claims}.${signature}`;
    const tokenHash = crypto.createHash('sha256').update(recoveryToken).digest('hex');
    await supabase.from('password_reset_grants').delete().lt('expires_at', new Date().toISOString());
    const { error: grantError } = await supabase.from('password_reset_grants').insert({
      email: OWNER_EMAIL,
      token_hash: tokenHash,
      expires_at: new Date(expires).toISOString(),
    });
    if (grantError) throw grantError;
    return res.status(200).json({ success: true, recoveryToken });
  } catch (error) {
    console.error('Password recovery verification failed:', error);
    return res.status(500).json({ error: 'Could not verify the code.' });
  }
}
