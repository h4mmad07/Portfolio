import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const OWNER_EMAIL = 'mh9456605@gmail.com';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = typeof req.body?.recoveryToken === 'string' ? req.body.recoveryToken : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  if (token.length > 2048) return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });
  if (newPassword.length < 12 || newPassword.length > 128) return res.status(400).json({ error: 'Use a password between 12 and 128 characters.' });

  const [claims, suppliedSignature, extra] = token.split('.');
  const otpSecret = process.env.OTP_HMAC_SECRET;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!otpSecret || otpSecret.length < 32 || !url || !serviceKey) return res.status(503).json({ error: 'Password recovery is temporarily unavailable.' });
  if (!claims || !suppliedSignature || extra) return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });

  const expectedSignature = crypto.createHmac('sha256', otpSecret).update(claims).digest();
  let actualSignature: Buffer;
  try { actualSignature = Buffer.from(suppliedSignature, 'base64url'); } catch { return res.status(400).json({ error: 'Recovery session expired. Request a new code.' }); }
  if (actualSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(actualSignature, expectedSignature)) {
    return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });
  }

  let parsed: { email?: string; expires?: number };
  try { parsed = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8')); } catch { return res.status(400).json({ error: 'Recovery session expired. Request a new code.' }); }
  if (parsed.email !== OWNER_EMAIL || !parsed.expires || parsed.expires < Date.now()) return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const { data: grant } = await supabase.from('password_reset_grants').select('id')
      .eq('email', OWNER_EMAIL).eq('token_hash', tokenHash).eq('used', false)
      .gt('expires_at', new Date().toISOString()).maybeSingle();
    if (!grant) return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });

    const { data: consumed, error: consumeError } = await supabase.from('password_reset_grants')
      .update({ used: true }).eq('id', grant.id).eq('used', false).select('id').maybeSingle();
    if (consumeError || !consumed) return res.status(400).json({ error: 'Recovery session expired. Request a new code.' });

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (usersError) throw usersError;
    const owner = users.users.find((user) => user.email?.toLowerCase() === OWNER_EMAIL);
    if (!owner) throw new Error('Owner account is not configured.');
    const { error: updateError } = await supabase.auth.admin.updateUserById(owner.id, { password: newPassword });
    if (updateError) throw updateError;
    return res.status(200).json({ success: true, message: 'Password updated. You can now sign in.' });
  } catch (error) {
    console.error('Password update failed:', error);
    return res.status(500).json({ error: 'Could not update the password. Request a new recovery code.' });
  }
}
