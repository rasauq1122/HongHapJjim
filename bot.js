// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { discord_bot_token } = require('./config.json');
const readline = require('readline');
const { stdin: input, stdout: output, exit } = require('process');
const path = require('path');
const fs = require('fs');
const { conn } = require('./config/db');

// Create a new client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,

    IntentsBitField.Flags.GuildVoiceStates,
] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(discord_bot_token);

const rl = readline.createInterface({ input, output });
rl.question("", (answer) => {
    client.destroy();
    conn.query('UPDATE service SET endTime = now() WHERE endTime is NULL', (err, rows, field) => {
        if (err) throw err;
    });
    exit();
});