const { channel } = require('diagnostics_channel');
const { Events } = require('discord.js');
const channelMove = require('./VoiceStateUpdate/channelMove');
const channelNotMove = require('./VoiceStateUpdate/channelNotMove');
const voiceEnd = require('./VoiceStateUpdate/voiceEnd');
const voiceStart = require('./VoiceStateUpdate/voiceStart');

module.exports = {
	name: Events.VoiceStateUpdate,
	execute(oldState, nowState) {
        queue = [
            voiceStart,
            channelMove,
            channelNotMove,
            voiceEnd,
        ]

        for (const func of queue) {
            func.execute(oldState, nowState);
        }
        
        // console.log(oldState.sessionId);
        // console.log(nowState.sessionId);
    },
};