const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const max = 3;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= max) return true;

  timestamps.push(now);
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-secret-token');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Token check
  const token = req.headers['x-secret-token'];
  if (token !== process.env.API_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  // Rate limit check
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — try again in an hour.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
