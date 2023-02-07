const { Events } = require('discord.js');
const { conn } = require('../config/db');
const { role_name, role_reason } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        const Guilds = client.guilds.cache;

        selectBadServiceQuery = 'SELECT guild, startTime FROM service WHERE endTime IS NULL';
        conn.query(selectBadServiceQuery, (err, row, field) => {
            if (err) throw err;
            for (ele of row) {
                const updateServiceEndTimeQuery = 
                'UPDATE service SET endTime = ? WHERE guild = ? AND startTime = ?';
                conn.query(updateServiceEndTimeQuery, [ele.startTime, ele.guild, ele.startTime], (err, row, field) => {
                    if (err) throw err;
                });
            }
        });
        
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
        
        // insert service that startTime is now.
        const insertServiceQuery = 'INSERT INTO service(guild, startTime) VALUES (?, NOW())';
        for (const [snowflake, guild] of Guilds) {
            conn.query(insertServiceQuery, [guild.id], (err, row, field) => {
                if (err) throw err;
            });
        }
        
	},
};