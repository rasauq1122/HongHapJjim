const { default: axios } = require('axios');
const { Events } = require('discord.js');
const { api_server_port } = require('../../config.json');
const apiServer = 'http://localhost:'+api_server_port;

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'badServiceUpdate',
	execute(client) {
        axios.put(apiServer+'/clean');
    },
};