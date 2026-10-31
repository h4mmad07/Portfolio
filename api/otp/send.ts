import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const OWNER_EMAIL = 'mh9456605@gmail.com';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const otpSecret = process.env.OTP_HMAC_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!url || !serviceKey || !otpSecret || otpSecret.length < 32 || !resendKey || !fromEmail) {
    return res.status(503).json({ error: 'Password recovery is temporarily unavailable.' });
  }

  // Use the same response for unknown accounts. Only the owner account receives a code.
  if (email !== OWNER_EMAIL) return res.status(200).json({ success: true, message: 'If the account is eligible, a code will be sent.' });

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const { data: allowed, error: limitError } = await supabase.rpc('allow_password_reset_request', { p_email: OWNER_EMAIL });
    if (limitError) throw limitError;
    if (!allowed) {
      return res.status(429).json({ error: 'Please wait before requesting another code.' });
    }

    const { error: invalidateError } = await supabase.from('password_reset_otps')
      .update({ used: true }).eq('email', OWNER_EMAIL).eq('used', false);
    if (invalidateError) throw invalidateError;
    await supabase.from('password_reset_otps').delete().lt('created_at', new Date(Date.now() - 24 * 60 * 60_000).toISOString());

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    const otpHash = crypto.createHmac('sha256', otpSecret).update(`${OWNER_EMAIL}:${code}`).digest('hex');
    const { error: insertError } = await supabase.from('password_reset_otps').insert({
      email: OWNER_EMAIL,
      otp_hash: otpHash,
      expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      used: false,
      attempt_count: 0,
    });
    if (insertError) throw insertError;

    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [OWNER_EMAIL],
        subject: 'Your portfolio password reset code',
        text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not request this code, ignore this email.`,
      }),
    });
    if (!mail.ok) {
      await supabase.from('password_reset_otps').update({ used: true }).eq('email', OWNER_EMAIL).eq('otp_hash', otpHash);
      console.error('Password recovery email provider rejected a message:', mail.status);
      return res.status(503).json({ error: 'Could not send a verification code. Please try again later.' });
    }

    return res.status(200).json({ success: true, message: 'If the account is eligible, a code will be sent.', email_masked: maskEmail(OWNER_EMAIL) });
  } catch (error) {
    console.error('Password recovery request failed:', error);
    return res.status(500).json({ error: 'Could not process the request.' });
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 1)}*****${local.slice(-1)}@${domain}`;
}
