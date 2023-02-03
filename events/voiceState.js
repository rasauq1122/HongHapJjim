const { Events } = require('discord.js');
const { conn } = require('../config/db');

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, nowState) {
        try {
            console.log(oldState.channel.id);
            console.log(nowState.channel.id);
        }
        catch (e) {
            console.log(e);
        }
    },
};