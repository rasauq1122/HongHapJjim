const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios');
const { api_server_port } = require('../config.json');
const apiServer = 'http://localhost:'+api_server_port;;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unsubscribe')
		.setDescription('홍합도둑으로부터 개인정보를 보호합니다!'),
	async execute(interaction) {
        const body = {
            memberId : interaction.member.id,
            guildId : interaction.guild.id,
        };
        if (interaction.member.voice.channel != null) {
            // console.log(interaction.member.voice.channelId);
            body.channelId = interaction.member.voice.channelId;
            axios.put(apiServer+'/voice/use', {data : body});
        }
        // console.log(body);
        axios.delete(apiServer+'/guild/subscribe', { data : body })
        .then(async (res) => {
            await interaction.reply(res.data.msg);
        })
        .catch((err)=>console.log(err.stack));
	},
};