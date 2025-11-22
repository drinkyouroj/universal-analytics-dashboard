import { Router } from 'express';
import { config } from 'dotenv';

config();

const router = Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3002/api/auth/discord/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/discord', (req, res) => {
  if (!CLIENT_ID) {
    return res.status(500).json({ error: 'Discord Client ID not configured' });
  }

  const scope = 'identify guilds bot';
  const permissions = '66560';
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&permissions=${permissions}`;
  
  res.redirect(url);
});

router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID!);
    params.append('client_secret', CLIENT_SECRET!);
    params.append('grant_type', 'authorization_code');
    params.append('code', code.toString());
    params.append('redirect_uri', REDIRECT_URI);

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to get token');
    }

    // In a real app, we would create a session/JWT here.
    // For now, we'll pass the access token to the frontend via query param (not secure for prod, but fine for MVP demo).
    // Ideally, we'd set a httpOnly cookie.
    
    res.redirect(`${FRONTEND_URL}/auth/success?token=${tokenData.access_token}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/auth/error`);
  }
});

export default router;

