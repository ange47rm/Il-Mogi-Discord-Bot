import { createAudioPlayer, getVoiceConnection } from '@discordjs/voice';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { chatCommands } from './helpers/chatCommands.js';
import { greetAll, joinVoiceChat, leaveVoiceChat, playRandomSound, playSound } from './helpers/utils.js';
import { botName, randomSoundTimeInterval } from './helpers/appConfig.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// When the bot is ready
client.once('ready', () => {
    console.log(`${botName} is running`);
    console.log('');
    console.log('Author: github.com/ange47rm');
    console.log('');
    console.log(`Logged in as ${client.user.tag}!`);
});

// Message reactions
client.on('messageCreate', message => {
    if (message.content === chatCommands.help.cmd) {
        message.react('🐔');

        let helpMessage = "Lista comandi\n";

        for (const [_, value] of Object.entries(chatCommands)) {
            helpMessage += `• **${value.cmd}** - *${value.description}*\n`;
        }

        message.reply(helpMessage);
    }
});

// Play specific sound
client.on('messageCreate', message => {
    if (message.content === chatCommands.helicopter.cmd) {
        playSound(message.member.voice.channel, "helicopter-helicopter.mp3");
        message.react('🚁');
    }
});

client.on('messageCreate', message => {
    if (message.content === chatCommands.yeahBoy.cmd) {
        playSound(message.member.voice.channel, "yeah-boi.mp3");
        message.react('👍🏿');
    }
});


// Join and play sounds in a voice channel
client.on('messageCreate', async message => {
    const voiceChannel = message.member.voice.channel;

    if (message.content === chatCommands.joinVoiceChannel.cmd && voiceChannel) {

        try {
            const connection = joinVoiceChat(voiceChannel);
            const player = createAudioPlayer();
            connection.subscribe(player);

            message.reply("pronto");
            message.react('🐔');

            console.log('Il Mogi has joined the voice channel.');

            // Play sound as soon as the bot joins the voice channel
            greetAll(player);

            const voiceChannelMembers = voiceChannel.members.filter(member => !member.user.bot);

            // Set interval to play a random sound
            setInterval(() => { playRandomSound(player); }, randomSoundTimeInterval);

            // Leave if no members are in the voice channel
            if (connection && voiceChannelMembers.size === 0) {
                leaveVoiceChat(connection);
            }

        } catch (error) {
            console.error('Error joining voice channel:', error.message);
        }
    }
});

// Listen for voice state updates once
client.on('voiceStateUpdate', (_oldState, newState) => {

    // Ignore bot leaves
    if (newState.member.user.bot) return;

    const voiceChannel = newState.channelId;

    // Prompt bot to leave the voice channel if there are no active members
    if (voiceChannel) {
        const connection = getVoiceConnection(newState.guild.id);
        const voiceChannelMembers = voiceChannel.members?.filter(member => !member.user.bot) || 0;

        if (connection && voiceChannelMembers.size === 0) {
            leaveVoiceChat(connection);
        }
    }
});

// Log the bot in using the token from your .env file
client.login(process.env.TOKEN).catch(error => {
    console.error('Error logging in:', error.message);
});
