const { Events } = require('discord.js');
const { conn } = require('../config/db');
const properRoleUpdate = require('./GuildMemberUpdate/properRoleUpdate');

module.exports = {
	name: Events.GuildMemberUpdate,
	execute(oldState, nowState) {
        queue = [
            // properRoleUpdate,
        ]

        for (const func of queue) {
            func.execute(oldState, nowState);
        }
    },
};