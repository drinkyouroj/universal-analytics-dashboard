import { Client, GatewayIntentBits, TextChannel, ChannelType } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.DISCORD_BOT_TOKEN;

let isReady = false;

if (TOKEN) {
  client.login(TOKEN)
    .then(() => {
      console.log('Discord Bot logged in');
      isReady = true;
    })
    .catch(err => console.error('Discord Bot Login Failed:', err));
} else {
  console.warn('DISCORD_BOT_TOKEN not provided. Discord features will be limited.');
}

export const getGuildChannels = async (guildId: string) => {
  if (!isReady) throw new Error('Discord Bot not ready');
  
  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) throw new Error('Guild not found');

    const channels = await guild.channels.fetch();
    
    // Filter for text channels
    return channels
      .filter(c => c && c.type === ChannelType.GuildText)
      .map(c => ({
        id: c!.id,
        name: c!.name,
        type: c!.type
      }));
  } catch (error) {
    console.error(`Error fetching channels for guild ${guildId}:`, error);
    throw error;
  }
};

export const getChannelMessages = async (channelId: string, limit = 50) => {
  if (!isReady) throw new Error('Discord Bot not ready');

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error('Channel not found or not text-based');
    }
    
    // Cast to TextChannel to access messages
    const textChannel = channel as TextChannel;
    const messages = await textChannel.messages.fetch({ limit });
    
    return messages.map(m => ({
      id: m.id,
      content: m.content,
      author: {
        id: m.author.id,
        username: m.author.username,
        bot: m.author.bot
      },
      timestamp: m.createdTimestamp,
      reactions: m.reactions.cache.size,
    }));
  } catch (error) {
    console.error(`Error fetching messages for channel ${channelId}:`, error);
    throw error;
  }
};

