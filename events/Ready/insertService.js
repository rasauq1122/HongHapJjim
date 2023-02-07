const { Events } = require('discord.js');
const { conn } = require('../../config/db');

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'insertService',
	execute(client) {
        const Guilds = client.guilds.cache;

        // insert service that startTime is now.
        const insertServiceQuery = 'INSERT INTO service(guild, startTime) VALUES (?, NOW())';
        for (const [snowflake, guild] of Guilds) {
            // console.log(guild.id);
            conn.query(insertServiceQuery, [guild.id], (err, row, field) => {
                if (err) throw err;
            });
        }
        
	},
};