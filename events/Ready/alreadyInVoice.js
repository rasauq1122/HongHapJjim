const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'alreadyInVoice',
	execute(client) {
        const Guilds = client.guilds.cache;                
        for (const [guildId, guild] of Guilds) {
            const body = {guildId : guild.id};
            const members = guild.members.cache;
            for (const [memberId, member] of members) {
                body.memberId = memberId;
                if (member.voice.channel != null) {
                    body.channelId = member.voice.channelId;
                    axios.post(apiServer+'/voice/use', {data: body});    
                }
            } 
        }
	},
};