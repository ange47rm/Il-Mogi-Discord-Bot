import fs from "fs";
import path from "path";
import {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
} from "@discordjs/voice";
import { fileURLToPath } from "url";
import { botName, randomSoundTimeInterval } from "./appConfig.js";
import { ChannelType } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const assetsPath = path.resolve(__filename, "../../assets");

// SOUND FUNCTIONS

export const greetAll = (player) => {
  const resource = createAudioResource(path.join(assetsPath, "un-pollo.mp3"));
  player.play(resource);
};

export const playSound = (voiceChannel, sound) => {
  const connection = joinVoiceChat(voiceChannel);

  const player = createAudioPlayer();
  connection.subscribe(player);

  const audioResource = createAudioResource(path.join(assetsPath, sound));
  player.play(audioResource);
};

let remainingSounds = [];
let playedSounds = [];

const excludedFiles = ["ciaooo.mp3"];

export const playRandomSound = (player) => {
  try {
    if (remainingSounds.length === 0) {
      const soundFiles = fs
        .readdirSync(assetsPath)
        .filter(
          (file) => file.endsWith(".mp3") && !excludedFiles.includes(file),
        );

      if (soundFiles.length === 0) {
        console.log(
          "No audio files found in the assets folder after excluding some files.",
        );
        return;
      }

      // Shuffle the sounds and reset arrays
      remainingSounds = shuffleArray(soundFiles);
      playedSounds = [];
    }

    // Pop a sound to play from the shuffled array
    const randomSoundFileName = remainingSounds.pop();

    // Track played sounds
    playedSounds.push(randomSoundFileName);

    // Play the selected sound
    const audioResource = createAudioResource(
      path.join(assetsPath, randomSoundFileName),
    );
    player.play(audioResource);

    console.log(`Playing: ${randomSoundFileName}`);
  } catch (error) {
    console.error("Error in playRandomSound:", error.message);
  }
};

// MISC FUNCTIONS

// Fisher-Yates shuffle
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const joinVoiceChat = (voiceChannel) => {
  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  return voiceConnection;
};

export const leaveVoiceChat = (connection) => {
  console.log(
    `No members left in the voice channel. ${botName} has left the chat.`,
  );
  connection.destroy();
};

export const joinVoiceChatAndPlayRandomSounds = (voiceChannel) => {
  const connection = joinVoiceChat(voiceChannel);
  const player = createAudioPlayer();
  connection.subscribe(player);

  console.log(`${botName} has joined the voice channel.`);

  // Play sound as soon as the bot joins the voice channel
  // greetAll(player);

  // Set interval to play a random sound
  const intervalId = setInterval(() => {
    const voiceChannelMembers = voiceChannel.members.filter(
      (member) => !member.user.bot,
    );

    // Check if there are any non-bot members in the voice channel
    if (voiceChannelMembers.size > 0) {
      playRandomSound(player);
    } else {
      // Stop the interval if no members are present
      clearInterval(intervalId);
    }
  }, randomSoundTimeInterval);
};

export const getActiveVoiceChannelIfAvailable = async (client) => {
  // Check all guilds the bot is part of
  for (const [_, guild] of client.guilds.cache) {
    try {
      // Ensure the guild cache is up-to-date
      await guild.fetch();
      const voiceChannels = guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildVoice,
      );

      for (const [_, channel] of voiceChannels) {
        // Filter out bot users in the channel
        const activeMembers = channel.members.filter(
          (member) => !member.user.bot,
        );

        // If active members are present in the voice channel, return it
        if (activeMembers.size > 0) {
          return channel;
        }
      }
    } catch (error) {
      console.error(`Error checking guild ${guild.name}:`, error.message);
    }
  }
};
