import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { playRandomSound, greetAll } from './sound-functions.js';
import { chatCommands } from './chatCommands.js';

dotenv.config();

const botName = "Il Mogi Discord Bot"

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
    console.log(`${botName} is running`)
    console.log('')
    console.log('Author: github.com/ange47rm')
    console.log('')
    console.log(`Logged in as ${client.user.tag}!`);
});

// Message reactions
client.on('messageCreate', message => {
    if (message.content === chatCommands.help) {
        message.react('🐔')

        const helpMessage = `
        **${botName} - Comandi:**
        - **${chatCommands.joinVoiceChannel}*: Invita Il Mogi alla chat vocale.
                `;

        message.reply(helpMessage);
    }
});

// Join and play sounds in a voice channel
client.on('messageCreate', async message => {
    const voiceChannel = message.member.voice.channel;

    if (message.content === chatCommands.joinVoiceChannel && voiceChannel) {
        message.react('🐔')

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            console.log('Il Mogi has joined the voice channel.');

            const player = createAudioPlayer();
            connection.subscribe(player);

            // Play sound as soon as bot joins the voice channel
            greetAll(player);

            // Set interval to play a random sound
            const interval = setInterval(() => {

                const voiceChannelMembers = voiceChannel.members.filter(member => !member.user.bot);
                if (voiceChannelMembers.size > 0) {
                    playRandomSound(player);
                } else {
                    console.log('No members in the voice channel. Stopping sound playback.');
                    clearInterval(interval);
                    connection.destroy(); // Disconnect if no members are present
                }

            }, 1000 * 60 * 5);
        } catch (error) {
            console.error('Error joining voice channel:', error.message);
        }
    }
});

// Log the bot in using the token from your .env file
client.login(process.env.TOKEN).catch(error => {
    console.error('Error logging in:', error.message);
});
