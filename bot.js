import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { playRandomSound, greetAll, playSound, joinVoiceChat } from './helpers/utils.js';
import { chatCommands } from './helpers/chatCommands.js';

dotenv.config();

export const botName = "Il Mogi Bot"

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
    if (message.content === chatCommands.help.cmd) {
        message.react('🐔')

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
        playSound(message.member.voice.channel, "helicopter-helicopter.mp3")
        message.react('🚁')
    }
})

client.on('messageCreate', message => {
    if (message.content === chatCommands.yeahBoy.cmd) {
        playSound(message.member.voice.channel, "yeah-boi.mp3")
        message.react('👍🏿')
    }
})

// Join and play sounds in a voice channel
client.on('messageCreate', async message => {
    const voiceChannel = message.member.voice.channel;

    if (message.content === chatCommands.joinVoiceChannel.cmd && voiceChannel) {
        message.react('🐔')

        try {
            const connection = joinVoiceChat(voiceChannel)

            const player = createAudioPlayer();
            connection.subscribe(player);

            message.reply("Pronto");

            console.log('Il Mogi has joined the voice channel.');

            // Play sound as soon as bot joins the voice channel
            greetAll(player);

            const timeInterval = 1000 * 60 * 4;

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

            }, timeInterval);
        } catch (error) {
            console.error('Error joining voice channel:', error.message);
        }
    }
});

// Log the bot in using the token from your .env file
client.login(process.env.TOKEN).catch(error => {
    console.error('Error logging in:', error.message);
});