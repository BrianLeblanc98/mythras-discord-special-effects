const { REST, Routes } = require('discord.js');
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// Clear all commands from all servers

const rest = new REST().setToken(token);

// for guild-based commands
rest
	.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), { body: [] })
	.then(() => console.log('clear-commands.js: Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest
	.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('clear-commands.js: Successfully deleted all application commands.'))
	.catch(console.error);