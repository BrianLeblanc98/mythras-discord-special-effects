const { REST, Routes } = require('discord.js');
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const pushCommand = (filePath) => {
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'dist/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);

	if (commandsPath.endsWith('.js')) {
		pushCommand(commandsPath);
	} else {
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			pushCommand(path.join(commandsPath, file));
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`deploy-commands.js: Started refreshing ${commands.length} application (/) commands.`);

		// await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
		// console.log('deploy-commands.js: Successfully removed old commands');

		// The put method is used to fully refresh all commands in the guild with the current set
		let data;
		if (process.env.GUILD_ID) {
			// Dev mode
			console.log ('deploy-commands.js: DEVELOPMENT');
			data = await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), { body: commands });
		} else {
			// Prod mode
			console.log('deploy-commands.js: PRODUCTION')
			data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
		}

		console.log(`deploy-commands.js: Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();