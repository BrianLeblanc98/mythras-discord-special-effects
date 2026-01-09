import { BaseInteraction, Events, MessageFlags } from 'discord.js';
import type { ClientWithCommands } from '../util';
import { dbAddGuild } from '../database';

/** Cache for all guildIds of interactions seen since startup */
const guildIdCache: string[] = [];

/** Event handler for all InteractionCreate events */
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: BaseInteraction) {
		if (interaction.isChatInputCommand()) {
			const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);

			if (!command) {
				console.error(`interactionCreate.js: No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				// If the guildId hasn't been seen yet, add it to the database, then add it to the cache
				if (interaction.guildId) {
					if (!guildIdCache.includes(interaction.guildId)) {
						await dbAddGuild(interaction.guildId);
						guildIdCache.push(interaction.guildId);
					}
				};
				
				// Try executing the command
				await command.execute(interaction);
			} catch (error) {
				console.error(error);

				// Make sure to respond to the interaction so that it doesn't hang in Discord
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				} else {
					await interaction.reply({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		} else if (interaction.isAutocomplete()) {
			const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			if (command.autocomplete) {
				try {
					await command.autocomplete(interaction);
				} catch (error) {
					console.error(error);
				}
			}
			
		}
	},
};