const { SlashCommandBuilder } = require('discord.js');
const { fileURLToPath } = require('url');
const { conn } = require('../config/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subscribe')
		.setDescription('홍합도둑에게 개인정보를 바칩니다...'),
	async execute(interaction) {
        const doesUserHaveRollQuery = 'SELECT * FROM subscriber WHERE guild = ? AND user = ?';
        conn.query(doesUserHaveRollQuery, [interaction.guild.id, interaction.member.id], async (err, row, field) => {
            if (err) throw err;
            if (row.length === 0) {
                const insertSubscriberQuery = 'INSERT subscriber(guild, user) VALUES (?, ?)';
                conn.query(insertSubscriberQuery, [interaction.guild.id, interaction.member.id], (err, row, field) => {
                    if (err) throw err;
                });
                await interaction.reply('이용해주셔서 감사합니다!');
            } 
            else {
                await interaction.reply('이미 이용중입니다.');
            }
        });

	},
};