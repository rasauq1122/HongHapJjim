const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

const state = ['selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

module.exports = {
	name: Events.VoiceStateUpdate,
    description : 'channelMove',
	execute(oldState, nowState) {
        // console.log(oldState.channelId, nowState.channelId);
        if (oldState.channel == null) return;
        if (nowState.channel == null) return;
        if (oldState.channelId === nowState.channelId) return; 
        
        console.log("move");

        const putBody =  {
            guildId : oldState.guild.id,
            channelId : oldState.channelId,
            memberId : oldState.member.id,
        };

        axios.put(apiServer+'/voice/use', { data : putBody });

        const postBody =  {
            channelId : nowState.channelId,
            guildId : nowState.guild.id,
            memberId : nowState.member.id,
        };

        for (const ele of state) {
            postBody[ele] = nowState[ele];
        }

        axios.post(apiServer+'/voice/use', { data : postBody });
    },
};