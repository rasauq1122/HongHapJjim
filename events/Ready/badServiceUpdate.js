const { Events } = require('discord.js');
const { conn } = require('../../config/db');

module.exports = {
	name: Events.ClientReady,
	once: true,
    description : 'badServiceUpdate',
	execute(client) {
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
    },
};