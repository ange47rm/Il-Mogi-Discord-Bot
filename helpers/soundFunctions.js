import fs from 'fs';
import path from 'path';
import { createAudioResource } from '@discordjs/voice';
import { fileURLToPath } from 'url';

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const greetAll = (player) => {
    const resource = createAudioResource(path.join(__dirname, '../assets', "ciaooo.mp3"));
    player.play(resource);
}

export const playRandomSound = (player) => {
    try {
        const sounds = fs.readdirSync(path.join(__dirname, 'assets')).filter(file => file.endsWith('.mp3') && file != 'ciaooo.mp3');
        if (sounds.length === 0) {
            console.log('No audio files found in the assets folder.');
            return;
        }

        // Pick a random sound
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        const resource = createAudioResource(path.join(__dirname, 'assets', randomSound));

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
