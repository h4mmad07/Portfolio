import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (Number(req.headers['content-length'] || 0) > 16_384) return res.status(413).json({ error: 'Message is too large.' });
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (req.body?.website) return res.status(200).json({ success: true });
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || subject.length > 160 || message.length < 10 || message.length > 5000) {
    return res.status(400).json({ error: 'Please check the message fields and try again.' });
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const rateSecret = process.env.RATE_LIMIT_HMAC_SECRET;
  if (!url || !serviceKey || !rateSecret || rateSecret.length < 32) return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (typeof req.headers['x-vercel-forwarded-for'] === 'string'
    ? req.headers['x-vercel-forwarded-for']
    : typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim();
  if (!clientIp) return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });
  const ipHash = crypto.createHmac('sha256', rateSecret).update(clientIp).digest('hex');
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: allowed, error: rateError } = await supabase.rpc('allow_contact_submission', { p_ip_hash: ipHash });
  if (rateError) return res.status(503).json({ error: 'Contact form is temporarily unavailable.' });
  if (!allowed) return res.status(429).json({ error: 'Please wait before sending another message.' });
  const { error } = await supabase.from('portfolio_contact_messages').insert({ name, email, subject: subject || null, message });
  if (error) return res.status(500).json({ error: 'Could not send your message. Please try again later.' });
  return res.status(200).json({ success: true });
}
