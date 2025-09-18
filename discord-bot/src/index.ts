import { Client, GatewayIntentBits, InteractionType } from 'discord.js';
import { createHttpServer } from './server/http';
import { logger } from './shared/logger';
import { handleInteraction } from './bot/commands';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  logger.warn('DISCORD_TOKEN not set; bot will not log in. HTTP server still runs.');
}

const app = createHttpServer();
const port = Number(process.env.PORT || 4300);
const server = app.listen(port, () => logger.info({ port }, 'http server started'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.on('ready', () => logger.info({ user: client.user?.tag }, 'bot logged in'));

client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    await handleInteraction(client, interaction);
  } catch (e) {
    logger.error({ err: e }, 'interaction error');
  }
});

if (token) client.login(token).catch((e) => logger.error({ err: e }, 'login failed'));

process.on('SIGINT', async () => {
  logger.info('shutting down');
  try { await client.destroy(); } catch {}
  server.close(() => process.exit(0));
});

