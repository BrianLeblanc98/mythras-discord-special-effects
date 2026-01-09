import { GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { ClientWithCommands, isCommand } from './util';
import { dbInit } from './database';
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client: ClientWithCommands = new ClientWithCommands({ intents: [GatewayIntentBits.Guilds] });

// Helper function to set a command in client.commands
const setCommand = (filePath: string) => {
	import(filePath).then(command => {
		if (isCommand(command)) {
			client.commands.set(command.data.name, command);
			console.log(`index.js: Command ${command.data.name} pushed`);
		} else {
			console.log(`index.js: [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	});
};

// Read all the files in src/commands folder and subfolders to set all the commands in client.commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	if (commandsPath.endsWith('.js')) {
		// For commands in the top level folder
		setCommand(commandsPath);
	} else {
		// Go through a single layer of subfolders, no more
		const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			setCommand(filePath);
		}
	}
}

// Read all the files in src/events folder to add all the event handlers to the client
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);

	// TODO: Consider creating event type
	import(filePath).then(event => {
		if (event.once) {
			// Used for events that only happen once, e.g. ready.ts
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			console.log(`index.js: Now listening for event ${event.name}`);
			client.on(event.name, (...args) => event.execute(...args));
		}
	});
}


// Read all the files in data/specialEffects and import them into the sqlite3 database
const specialEffectsPath = path.join(__dirname, 'specialEffects');
dbInit(specialEffectsPath).then(n => console.log(`${n} Special effects imported from disk`));

client.login(token);