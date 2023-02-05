// Require the necessary discord.js classes
const { REST, Routes, Client, Events, GatewayIntentBits, IntentsBitField, Collection } = require('discord.js');
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
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers 
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

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

    if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
	}

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(discord_bot_token);

const rl = readline.createInterface({ input, output });
rl.question("", (answer) => {
    client.destroy();
    conn.query('UPDATE service SET endTime = now() WHERE endTime is NULL', (err, rows, field) => {
        if (err) throw err;
    });
    exit();
});