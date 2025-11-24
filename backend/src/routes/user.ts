import { Router } from 'express';

const router = Router();

router.get('/guilds', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guilds from Discord');
    }

    const guilds = await response.json();
    res.json(guilds);
  } catch (error) {
    console.error('Error fetching user guilds:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

export default router;



