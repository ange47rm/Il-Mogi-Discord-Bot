import fs from 'fs';
import path from 'path';
import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const assetsPath = path.resolve(__filename, '../../assets');

export const greetAll = (player) => {
    const resource = createAudioResource(path.join(assetsPath, "ahhh.mp3"));
    player.play(resource);
}

export const playSound = (voiceChannel, sound) => {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const resource = createAudioResource(path.join(assetsPath, sound));
    player.play(resource);
}

export const playRandomSound = (player) => {
    try {
        const sounds = fs.readdirSync(assetsPath).filter(file => file.endsWith('.mp3') && file != 'ciaooo.mp3');
        if (sounds.length === 0) {
            console.log('No audio files found in the assets folder.');
            return;
        }

        // Pick a random sound
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        const resource = createAudioResource(path.join(assetsPath, randomSound));

        player.play(resource);

        player.on('idle', () => {
            console.log('Finished playing:', randomSound);
        });

        player.on('error', error => {
            console.error('Error playing audio:', error.message);
        });
    } catch (error) {
        console.error('Error in playRandomSound:', error.message);
    }
};

