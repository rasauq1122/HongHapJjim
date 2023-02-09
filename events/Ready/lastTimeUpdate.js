const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'lastTimeUpdate',
	execute(client) {
        const Guilds = client.guilds.cache;                
        for (const [snowflake, guild] of Guilds) {
            const body = {guildId : guild.id};
            axios.post(apiServer+'/guild/lastTime', {data: body});
            axios.put(apiServer+'/guild/lastTime', {data: body});
        }
	},
};