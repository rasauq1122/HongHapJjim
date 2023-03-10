const { Events } = require('discord.js');
const axios = require('axios');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'insertService',
	execute(client) {
        const Guilds = client.guilds.cache;

        // insert service that startTime is now.
        for (const [snowflake, guild] of Guilds) {
            axios.post(apiServer+'/guild/service', { data :{
                guildId : guild.id
            }});
        }
	},
};