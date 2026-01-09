import {
    ChatInputCommandInteraction,
    ComponentType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from 'discord.js';
import { seConfigContainerBuilder, seConfigTimedOutContainerBuilder, specialEffectSourceDisableButtonID, specialEffectSourceEnableButtonID } from '../commandFunctions/se-config';
import { dbAddEnabledSource, dbDeleteEnabledSource } from '../database';

module.exports = {
    data: new SlashCommandBuilder()
		.setName('se-config')
		.setDescription('Configure which sources to use for Special Effects across the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction) {
        /** Timeout the config menu to avoid using old messages that no longer work */
        const timeout = 300_000; // 5 Minutes

        if (!interaction.guildId) throw '/se-config No guildId';
        const guildId = interaction.guildId;

        // Cache the current selection for future updates
        let currentSelection: string;
        
        // Create the initial response message
        const containerBuilder = await seConfigContainerBuilder(guildId);
        const response = await interaction.reply({
            components: [containerBuilder],
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            withResponse: true
        });

        // Time out the original message at the same time as the listeners
        setTimeout(() => {
            interaction.editReply({ components: [seConfigTimedOutContainerBuilder()] });
        }, timeout);

        // String select collector, updates the response based on which source was selected
        const stringSelectCollector = response.resource?.message?.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: timeout,
        });
        stringSelectCollector?.on('collect', async (i) => {
            const selection = i.values[0];
            currentSelection = selection;
            const containerBuilder = await seConfigContainerBuilder(guildId, currentSelection);
            await i.update({
                components: [containerBuilder]
            });
        });

        // Button collector, see commandFunction/se-config.ts, updates the database based on which button was pressed
        const buttonCollector = response.resource?.message?.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: timeout,
        });
        buttonCollector?.on('collect', async (i) => {
            if (currentSelection) {
                if (i.customId === specialEffectSourceEnableButtonID) {
                    await dbAddEnabledSource(guildId, currentSelection);
                } else if (i.customId === specialEffectSourceDisableButtonID) {
                    await dbDeleteEnabledSource(guildId, currentSelection);
                } else {
                    // More buttons could exist in future
                    console.error('commands/se-config.js: execute - Button collector error, wrong customId');
                }
                const containerBuilder = await seConfigContainerBuilder(guildId, currentSelection);
                await i.update({
                    components: [containerBuilder]
                });
            } else {
                console.error('commands/se-config.js: execute() - Button collector error, no currentSelection');
            }
        });

    }
};