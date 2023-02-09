const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

const state = ['selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

module.exports = {
	name: Events.VoiceStateUpdate,
    description : 'voiceStart',
	execute(oldState, nowState) {
        if (oldState.channel != null) return;

        const body =  {
            channelId : nowState.channelId,
            guildId : nowState.guild.id,
            memberId : nowState.member.id,
        };

        for (const ele of state) {
            body[ele] = nowState[ele];
        }

        axios.post(apiServer+'/voice/use', { data : body });
    },
};