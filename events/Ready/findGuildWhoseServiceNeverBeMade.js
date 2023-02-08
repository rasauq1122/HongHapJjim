const { Events } = require('discord.js');
const { conn } = require('../../config/db');
const { role_name, role_reason } = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'findGuildWhoseServiceNeverBeMade',
	execute(client) {
        const Guilds = client.guilds.cache;                
        // select guild whose service never be made.
        const selectInitialServiceQuery = 'SELECT * FROM service WHERE guild = ?';
        for (const [snowflake, guild] of Guilds) {
            conn.query(selectInitialServiceQuery, [guild.id], async (err, row, field) => {
                if (err) throw err;
                if (row.length != 0) return;
                
                
                
            });
        }
	},
};