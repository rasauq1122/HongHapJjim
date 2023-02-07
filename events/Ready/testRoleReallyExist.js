const { Events } = require('discord.js');
const { conn } = require('../../config/db');
const { role_name, role_reason } = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'testRoleReallyExist',
	execute(client) {
        const Guilds = client.guilds.cache;
        
        // check if role exists.
        selectRoleQuery = 'SELECT role FROM role WHERE guild = ?';
        for (const [snowflake, guild] of Guilds) {
            conn.query(selectRoleQuery, [guild.id], (err, row, field) => {
                if (err) throw err;
                guild.roles.fetch(row[0].role)
                .then(async (role) => {
                    if (role != null) return;
                    role = await guild.roles.create({
                        name: role_name,
                        reason: role_reason
                    });
                    const updateRoleQuery = 'UPDATE role SET role = ? WHERE guild = ?';
                    conn.query(updateRoleQuery, [role.id, guild.id], (err, row, field) => {
                        if (err) throw err;  
                    });
                })
                .catch(console.log);
            });
        }
	},
};