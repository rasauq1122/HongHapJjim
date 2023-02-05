const { SlashCommandBuilder } = require('discord.js');
const { conn } = require('../config/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subscribe')
		.setDescription('홍합도둑에게 개인정보를 바칩니다...'),
	async execute(interaction) {
        const selectRoleQuery = 'SELECT role FROM role WHERE guild = ?';
        // interaction.member.roles.get()
        conn.query(selectRoleQuery, [interaction.guild.id], async (err, row, field) => {
            if (err) throw err;
            const role = row[0].role;
            if (interaction.member.roles.cache.get(role) === undefined) {
                await interaction.member.roles.add(role);
                await interaction.reply('이용해주셔서 감사합니다!');
            }
            else {
                await interaction.reply('이미 역할이 부여되었습니다.')
            }
        });

	},
};