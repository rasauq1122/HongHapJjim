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
            // 1. make role
            conn.query(selectInitialServiceQuery, [guild.id], async (err, row, field) => {
                if (err) throw err;
                if (row.length === 0) {
                    role = await guild.roles.create({
                        name: role_name,
                        reason: role_reason
                    });
                    const insertRoleQuery = 'INSERT INTO role(guild, role) VALUES (?, ?)';
                    conn.query(insertRoleQuery, [guild.id, role.id], (err, row, field) => {
                        if (err) throw err;
                    });
                }
            });
        }
	},
};