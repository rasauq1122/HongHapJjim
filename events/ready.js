const { Events } = require('discord.js');
const badServiceUpdate = require('./Ready/badServiceUpdate');
const lastTimeUpdate = require('./Ready/lastTimeUpdate');
const insertService = require('./Ready/insertService');
const alreadyInVoice = require('./Ready/alreadyInVoice');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        queue = [
            badServiceUpdate,
            lastTimeUpdate,
            alreadyInVoice,
            insertService,
        ]

        for (const func of queue) {
            func.execute(client);
        }

	},
};