# Universal Analytics Dashboard

A full-stack application for real-time sentiment analysis and Discord server analytics.

## Features

- **Universal Content Analytics**: Paste any text to get instant sentiment, emotion, and readability analysis.
- **Discord Integration**: Connect your Discord server to analyze channel messages, user engagement, and sentiment trends.
- **Modern UI**: Built with React, Tailwind CSS, and Recharts for beautiful visualizations.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Recharts, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Analysis**: Sentiment.js, Natural (NLP).
- **Integration**: Discord.js, Discord OAuth2.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Discord Developer Application (for Bot Token and OAuth Client ID)

### Backend Setup

1. Navigate to `backend`:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend` with the following credentials:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   
   # Discord Configuration
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3001/api/auth/discord/callback
   DISCORD_BOT_TOKEN=your_discord_bot_token
   ```

   > **Note**: To get Discord credentials, create an app at [Discord Developer Portal](https://discord.com/developers/applications). 
   > - Enable "Message Content Intent" for the Bot.
   > - Add `http://localhost:3001/api/auth/discord/callback` to Redirects.

3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in `frontend` (optional if defaults work):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Universal Analytics**: Simply paste text and click "Analyze".
2. **Discord Analytics**:
   - Click "Connect Discord Server".
   - Authorize the application.
   - Select a Server and a Channel to view analysis.
   - **Note**: The Bot must be in the server to read messages. The OAuth flow attempts to add the bot, but you might need to ensure it has "Read Messages" and "Read Message History" permissions.

## Project Structure

- `frontend/`: React application
- `backend/`: Express API and Discord Bot service

## License

MIT

