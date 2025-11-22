import { Router } from 'express';
import { getGuildChannels, getChannelMessages } from '../services/discord';
import { analyzeContent } from '../services/analytics';

const router = Router();

// Get channels for a guild
router.get('/guilds/:guildId/channels', async (req, res) => {
  try {
    const { guildId } = req.params;
    const channels = await getGuildChannels(guildId);
    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Analyze a specific channel
router.get('/channels/:channelId/analyze', async (req, res) => {
  try {
    const { channelId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    const messages = await getChannelMessages(channelId, limit);
    
    // Analyze all messages
    // In a real app, we'd use a queue or batch processing
    const analyzedMessages = messages
      .filter(m => m.content.length > 0)
      .map(m => ({
        ...m,
        analysis: analyzeContent(m.content)
      }));

    // Aggregate stats
    const totalSentiment = analyzedMessages.reduce((acc, m) => acc + m.analysis.sentiment.score, 0);
    const avgSentiment = totalSentiment / (analyzedMessages.length || 1);
    
    // User activity
    const userActivity: Record<string, number> = {};
    messages.forEach(m => {
        userActivity[m.author.username] = (userActivity[m.author.username] || 0) + 1;
    });

    const topUsers = Object.entries(userActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([username, count]) => ({ username, count }));

    res.json({
      channelId,
      messageCount: messages.length,
      averageSentiment: avgSentiment,
      topUsers,
      messages: analyzedMessages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze channel' });
  }
});

export default router;

