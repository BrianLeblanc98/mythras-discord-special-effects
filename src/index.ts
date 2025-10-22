import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { ClientWithCommands } from './util';

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client: ClientWithCommands = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
client.commands = new Collection();

const pushCommand = (filePath: string) => {
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	import(filePath).then(command => {
		if ('data' in command && 'execute' in command) {
			client.commands?.set(command.data.name, command);
		} else {
			console.log(`index.js: [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	});
};

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	if (commandsPath.endsWith('.js')) {
		pushCommand(commandsPath);
	} else {
		const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			pushCommand(filePath);
		}
	}
}

// Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	import(filePath).then(event => {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	});
}

client.login(token);