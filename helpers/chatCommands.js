// List of commands to be used in Discord text chat

const botName = "Il Mogi Bot";

export const chatCommands = {
    help: { cmd: "!help", description: "Lista comandi" },
    joinVoiceChannel: { cmd: "!join", description: `Invita ${botName} alla chat vocale` },
    leaveVoiceChannel: { cmd: "!leave", description: `Disconnetti ${botName} dalla chat vocale` },
    helicopter: { cmd: "!heli", description: "Helicoper helicopter" },
    yeahBoy: { cmd: "!yb", description: "Yeah boiii" }
}
