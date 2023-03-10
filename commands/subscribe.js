const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios');
const { api_server_port } = require('../config.json');
const apiServer = 'http://localhost:'+api_server_port;;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subscribe')
		.setDescription('홍합도둑에게 개인정보를 바칩니다...'),
	async execute(interaction) {
        const body = {
            memberId : interaction.member.id,
            guildId : interaction.guild.id,
        };
        axios.post(apiServer+'/guild/subscribe', { data : body })
        .then(async (res) => {
            await interaction.reply(res.data.msg);
        });
        if (interaction.member.voice.channel != null) {
            body.channelId = interaction.member.voice.channelId;
            axios.post(apiServer+'/voice/use', {data : body});
        }
	},
};