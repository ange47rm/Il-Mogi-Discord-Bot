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
    const connection = joinVoiceChat(voiceChannel)

    const player = createAudioPlayer();
    connection.subscribe(player);

    const resource = createAudioResource(path.join(assetsPath, sound));
    player.play(resource);
}

let remainingSounds = [];
let playedSounds = [];

// Array of files you want to exclude
const excludedFiles = ['ciaooo.mp3'];

export const playRandomSound = (player) => {
    try {
        if (remainingSounds.length === 0) {
            const soundFiles = fs.readdirSync(assetsPath)
                .filter(file => file.endsWith('.mp3') && !excludedFiles.includes(file));

            if (soundFiles.length === 0) {
                console.log('No audio files found in the assets folder after excluding some files.');
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
        const audioResource = createAudioResource(path.join(assetsPath, randomSoundFileName));
        player.play(audioResource);

        console.log(`Playing: ${randomSoundFileName}`);

    } catch (error) {
        console.error('Error in playRandomSound:', error.message);
    }
};

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
}
