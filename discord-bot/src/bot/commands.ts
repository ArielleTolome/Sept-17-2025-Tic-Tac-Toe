import { REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import { z } from 'zod';
import fetch from 'node-fetch';
import { subscribeRoom } from './ws';

const env = {
  token: process.env.DISCORD_TOKEN || '',
  guildId: process.env.GUILD_ID || '',
  apiBase: process.env.API_BASE_URL || '',
  wsBase: process.env.WS_BASE_URL || ''
};

export const commandData = [
  new SlashCommandBuilder()
    .setName('ttt')
    .setDescription('Tic-Tac-Toe commands')
    .addSubcommand((sc) =>
      sc
        .setName('create')
        .setDescription('Create a new room')
        .addStringOption((o) => o.setName('opponent').setDescription('Display name of opponent').setRequired(false)),
    )
    .addSubcommand((sc) =>
      sc
        .setName('join')
        .setDescription('Get a link to join a room')
        .addStringOption((o) => o.setName('roomid').setDescription('Room ID').setRequired(true)),
    )
    .addSubcommand((sc) =>
      sc
        .setName('spectate')
        .setDescription('Get a replay link for a finished game')
        .addStringOption((o) => o.setName('gameid').setDescription('Game ID').setRequired(true)),
    )
    .addSubcommand((sc) =>
      sc
        .setName('live')
        .setDescription('Subscribe this channel to live updates for a room')
        .addStringOption((o) => o.setName('roomid').setDescription('Room ID').setRequired(true)),
    )
].map((c) => c.toJSON());

export async function deployCommands() {
  if (!env.token) throw new Error('DISCORD_TOKEN required');
  const rest = new REST({ version: '10' }).setToken(env.token);
  if (env.guildId) {
    await rest.put(Routes.applicationGuildCommands((await whoami(rest)).id, env.guildId), { body: commandData });
  } else {
    await rest.put(Routes.applicationCommands((await whoami(rest)).id), { body: commandData });
  }
}

async function whoami(rest: REST): Promise<{ id: string }> {
  const data = await rest.get(Routes.oauth2CurrentApplication());
  // @ts-expect-error - discord types
  return { id: data.id };
}

export async function handleInteraction(client: Client, interaction: ChatInputCommandInteraction) {
  if (interaction.commandName !== 'ttt') return;
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') return handleCreate(interaction);
  if (sub === 'join') return handleJoin(interaction);
  if (sub === 'spectate') return handleSpectate(interaction);
  if (sub === 'live') return handleLive(interaction, client);
}

async function handleCreate(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const opponent = interaction.options.getString('opponent') || 'Opponent';
  try {
    const res = await fetch(`${env.apiBase}/api/rooms`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ a: interaction.user.username, b: opponent })
    });
    const json = await res.json();
    const parsed = z.object({ id: z.string() }).safeParse(json);
    if (!parsed.success) throw new Error('Invalid response');
    const roomId = parsed.data.id;
    const link = `${env.apiBase.replace(/\/api$/, '')}/#/room/${encodeURIComponent(roomId)}`;
    await interaction.editReply(`Room created: ${link}`);
  } catch (e: any) {
    await interaction.editReply(`Failed to create room: ${e.message}`);
  }
}

async function handleJoin(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const roomId = interaction.options.getString('roomid', true);
  const link = `${env.apiBase.replace(/\/api$/, '')}/#/room/${encodeURIComponent(roomId)}`;
  await interaction.editReply(`Join this room: ${link}`);
}

async function handleSpectate(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const gameId = interaction.options.getString('gameid', true);
  const link = `${env.apiBase.replace(/\/api$/, '')}/#/replay/${encodeURIComponent(gameId)}?autoPlay=1`;
  await interaction.editReply(`Replay link: ${link}`);
}

async function handleLive(interaction: ChatInputCommandInteraction, client: Client) {
  const roomId = interaction.options.getString('roomid', true);
  await interaction.reply({ content: `Subscribing to live updates for 
room ${roomId} in this channel.`, ephemeral: false });
  const channel = interaction.channelId;
  subscribeRoom(env.wsBase, roomId, async (summary) => {
    const ch = await client.channels.fetch(channel);
    if (ch && ch?.isTextBased()) {
      await ch.send(summary);
    }
  });
}

