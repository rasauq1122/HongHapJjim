const { Events } = require('discord.js');
const badServiceUpdate = require('./Ready/badServiceUpdate');
const findGuildWhoseServiceNeverBeMade = require('./Ready/findGuildWhoseServiceNeverBeMade');
const insertService = require('./Ready/insertService');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        queue = [
            badServiceUpdate,
            findGuildWhoseServiceNeverBeMade,
            insertService,
        ]

        for (const func of queue) {
            func.execute(client);
        }

	},
};