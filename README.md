# Universal Analytics Dashboard

A full-stack application for real-time sentiment analysis and Discord server analytics.

## Features

- **Universal Content Analytics**: Paste any text to get instant sentiment, emotion, and readability analysis.
- **Discord Integration**: Connect your Discord server to analyze channel messages, user engagement, and sentiment trends.
- **Modern UI**: Built with React, Tailwind CSS, and Recharts for beautiful visualizations.
- **Filtering**: Filter Discord statistics by User and Role.

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
   PORT=3002
   FRONTEND_URL=http://localhost:5173
   
   # Discord Configuration
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3002/api/auth/discord/callback
   DISCORD_BOT_TOKEN=your_discord_bot_token
   ```

   > **CRITICAL**: To get Discord credentials, create an app at [Discord Developer Portal](https://discord.com/developers/applications). 
   > 1. **Bot Tab**:
   >    - Enable **Message Content Intent**.
   >    - Enable **Server Members Intent** (Required for Role filtering).
   >    - Reset Token to get `DISCORD_BOT_TOKEN`.
   > 2. **OAuth2 Tab**:
   >    - Add Redirect: `http://localhost:3002/api/auth/discord/callback`
   >    - Copy `Client ID` and `Client Secret`.

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

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Universal Analytics**: Simply paste text and click "Analyze".
2. **Discord Analytics**:
   - Click "Connect Discord Server".
   - Authorize the application.
   - Select a Server and a Channel to view analysis.
   - Use the **User** and **Role** dropdowns to filter the statistics.

## Troubleshooting

- **Connection Error**: Ensure Backend is running on port 3002.
- **Discord Error**: Ensure the Bot is invited to the server and has "Read Messages" and "View Channel" permissions.
- **Missing Roles**: Ensure "Server Members Intent" is enabled in the Discord Developer Portal.

## Project Structure

- `frontend/`: React application
- `backend/`: Express API and Discord Bot service

## License

MIT
