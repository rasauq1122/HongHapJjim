const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberUpdate,
	execute(oldState, nowState) {
        queue = [
        ]

        for (const func of queue) {
            func.execute(oldState, nowState);
        }
    },
};