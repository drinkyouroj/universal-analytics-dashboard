import { Router } from 'express';
import { analyzeContent } from '../services/analytics';
import { saveAnalysis } from '../db';

const router = Router();

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      res.status(400).json({ error: 'Text content is required' });
      return;
    }

    const result = analyzeContent(text);
    
    // Save to DB asynchronously (fire and forget)
    saveAnalysis(text, result.sentiment.score, result.sentiment.comparative);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

