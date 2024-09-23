import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { playRandomSound, greetAll } from './sound-functions.js'; // Note the .js extension

dotenv.config(); // For handling token securely

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
    console.log('Richard Benson Discord BOT is running')
    console.log('')
    console.log('Author: github.com/ange47rm')
    console.log('')
    console.log(`Logged in as ${client.user.tag}!`);
});

// Message reaction feature
client.on('messageCreate', message => {
    if (message.content === '!rb') {
        message.react('🐔')

        const helpMessage = `
        **Richard Benson Discord BOT - Comandi:**
        - **!rb-aiutame-tu**: Invita Riccardo Bensoni alla chat vocale.
                `;

        message.reply(helpMessage);
    }
});

// Join and play sounds in a voice channel
client.on('messageCreate', async message => {
    if (message.content === '!rb-aiutame-tu' && message.member.voice.channel) {
        message.react('🐔')

        const voiceChannel = message.member.voice.channel;

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            connection.subscribe(player);

            // Play sound as soon as bot joins the voice channel
            greetAll(player);

            // Set interval to play sound every 5 minutes (300000 ms)
            const interval = setInterval(() => {
                try {
                    const members = voiceChannel.members.filter(member => !member.user.bot);
                    if (members.size > 0) {
                        playRandomSound(player); // Pass the player to the function
                    } else {
                        console.log('No members in the voice channel. Stopping sound playback.');
                        clearInterval(interval);
                        connection.destroy(); // Disconnect if no members are present
                    }
                } catch (error) {
                    console.error('Error in interval check:', error.message);
                }
            }, 1000 * 60 * 1); // 5 minutes
        } catch (error) {
            console.error('Error joining voice channel:', error.message);
        }
    }
});

// Log the bot in using the token from your .env file
client.login(process.env.TOKEN).catch(error => {
    console.error('Error logging in:', error.message);
});
