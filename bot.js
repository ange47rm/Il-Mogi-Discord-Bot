import { getVoiceConnection } from "@discordjs/voice";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { botName } from "./helpers/appConfig.js";
import { chatCommands } from "./helpers/chatCommands.js";
import {
  getActiveVoiceChannelIfAvailable,
  joinVoiceChatAndPlayRandomSounds,
  leaveVoiceChat,
  playSound,
} from "./helpers/utils.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", async () => {
  console.log(`${botName} is running`);
  console.log("");
  console.log("Author: github.com/ange47rm");
  console.log("");
  console.log(`Logged in as ${client.user.tag}!`);

  const activeVoiceChannel = await getActiveVoiceChannelIfAvailable(client);

  if (activeVoiceChannel) {
    joinVoiceChatAndPlayRandomSounds(activeVoiceChannel);
  }

  getActiveVoiceChannelIfAvailable(client);
});

// Message reactions
client.on("messageCreate", (message) => {
  if (message.content === chatCommands.help.cmd) {
    message.react("🐔");

    let helpMessage = "Lista comandi\n";

    for (const [_, value] of Object.entries(chatCommands)) {
      helpMessage += `• **${value.cmd}** - *${value.description}*\n`;
    }

    message.reply(helpMessage);
  }
});

// Play specific sound
client.on("messageCreate", (message) => {
  if (message.content === chatCommands.helicopter.cmd) {
    playSound(message.member.voice.channel, "helicopter-helicopter.mp3");
    message.react("🚁");
  }
});

client.on("messageCreate", (message) => {
  if (message.content === chatCommands.yeahBoy.cmd) {
    playSound(message.member.voice.channel, "yeah-boi.mp3");
    message.react("👍🏿");
  }
});

// Join and play sounds in a voice channel
client.on("messageCreate", async (message) => {
  const voiceChannel = message.member.voice.channel;

  if (message.content === chatCommands.joinVoiceChannel.cmd && voiceChannel) {
    try {
      joinVoiceChatAndPlayRandomSounds(voiceChannel);
    } catch (error) {
      console.error("Error joining voice channel:", error.message);
      message.reply("Failed to join voice channel.");
    }
  } else if (!voiceChannel) {
    message.reply("You need to be in a voice channel to invite the bot!");
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  // Ignore changes from bots, including the bot itself
  if (newState.member.user.bot) return;

  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  // If the user leaves the channel (old channel exists, but new channel does not)
  if (oldChannel && !newChannel) {
    const connection = getVoiceConnection(oldState.guild.id);

    // Check if there are no more non-bot members in the voice channel
    const remainingMembers = oldChannel.members.filter(
      (member) => !member.user.bot,
    );
    if (connection && remainingMembers.size === 0) {
      leaveVoiceChat(connection);
    }
  }

  // If a member joins the voice channel, you may want to check the current state and resume playback
  if (newChannel && newChannel.members.size > 0) {
    const connection = getVoiceConnection(newState.guild.id);
    if (!connection) {
      // Get voice channel and join
      joinVoiceChatAndPlayRandomSounds(newChannel);
    }
  }
});

client.login(process.env.TOKEN).catch((error) => {
  console.error("Error logging in:", error.message);
});
