import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import discordRoutes from './routes/discord';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
