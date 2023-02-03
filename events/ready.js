const { Events } = require('discord.js');
const { conn } = require('../config/db');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        
        selectQuery = 'SELECT guild FROM service WHERE endTime IS NULL';
        conn.query(selectQuery, (err, row, field) => {
            if (err) throw err;
            console.log(row);
        });

        insertQuery = 'INSERT INTO service(guild, startTime) VALUES (?, NOW())';
        const Guilds = client.guilds.cache.map(guild => guild.id);
        for (guildId of Guilds) {
            conn.query(insertQuery, [guildId], (err, row, field) => {
                if (err) throw err;
            });
        }
        
	},
};