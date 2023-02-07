const { Events } = require('discord.js');
const { conn } = require('../../config/db');
const { role_name, role_reason } = require('../../config.json');

module.exports = {
	name: Events.GuildMemberUpdate,
	once: true,
    description : 'properRoleUpdate',
	execute(oldState, newState) {
        const guild = newState.guild;
        const roles = newState.roles;
        const selectRoleQuery = 'SELECT role FROM role WHERE guild = ?';
        try {
            conn.query(selectRoleQuery, [guild.id], (err, row, field) => {
                if (err) throw err;
                if (roles.cache[row[0].role] === undefined) {
                    roles.remove(row[0].role, 'This role is only for subscribers!');
                }
            });
        }
        catch (e) {
            console.log(e);
        }
	},
};