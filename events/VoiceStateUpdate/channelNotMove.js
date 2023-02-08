const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

const state = ['selfMute', 'selfDeaf', 'serverMute', 
               'serverDeaf', 'streaming', 'selfVideo'];

module.exports = {
	name: Events.VoiceStateUpdate,
    description : 'channelNotMove',
	execute(oldState, nowState) {
        if (oldState.channelId != nowState.channelId) return;
        
        const onBody =  {
            guildId : oldState.guild.id,
            channelId : oldState.channelId,
            memberId : oldState.member.id,
            toggle : {},
        };
        
        const offBody =  {
            guildId : oldState.guild.id,
            channelId : oldState.channelId,
            memberId : oldState.member.id,
            toggle : {},
        };

        for (const ele of state) {
            onBody.toggle[ele] = false;
            offBody.toggle[ele] = false;
        }
        
        
        for (const ele of state) {
            if (oldState[ele] != nowState[ele]) {
                if (nowState[ele]) onBody.toggle[ele] = true;
                else offBody.toggle[ele] = true;
            }
        }
        
        axios.post(apiServer+'/voice/toggle', { data : onBody });
        axios.put(apiServer+'/voice/toggle', { data : offBody });
    },
};