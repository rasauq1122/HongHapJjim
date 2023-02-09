const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

const state = ['selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

module.exports = {
	name: Events.VoiceStateUpdate,
    description : 'voiceEnd',
	execute(oldState, nowState) {
        if (nowState.channel != null) return;

        const body =  {
            guildId : oldState.guild.id,
            channelId : oldState.channelId,
            memberId : oldState.member.id,
        };

        axios.put(apiServer+'/voice/use', { data : body });
    },
};