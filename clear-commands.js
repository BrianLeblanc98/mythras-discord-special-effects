const { REST, Routes } = require('discord.js');
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// Clear all commands from all servers

const rest = new REST().setToken(token);
(async () => {
  try {
    console.log('clear-commands.js: Starting clearing application (/) commands');
    await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), { body: [] });
    await rest.put(Routes.applicationCommands(clientId), { body: [] });

    console.log('clear-commands.js: Successfully cleared application (/) commands');
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();