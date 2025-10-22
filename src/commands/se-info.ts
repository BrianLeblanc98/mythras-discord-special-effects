import {
  AttachmentBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder
} from 'discord.js';
import { crbSpecialEffects } from '../data/specialEffects/crb';
import { seInfoMessageContainerBuilder } from '../util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se-info')
    .setDescription('Replies with the description of a Special Effect, along with more info')
    .addStringOption(option =>
      option
        .setName('special-effect')
        .setDescription('The Special Effect you want information about')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName('show-all')
        .setDescription('Make the response visible to the whole channel instead of only you')
        .setRequired(false)
        .addChoices({ name: 'True', value: 'True' })
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused();
    const seNames = crbSpecialEffects.map(se => se.name);
    const filtered = seNames.filter((choice) => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));

    // Show nothing until under the maximum, always happens after 1 character
    if (filtered.length <= 25) {
      await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    } else {
      await interaction.respond([]);
    }
	},
  async execute(interaction: ChatInputCommandInteraction) {
    const seOption = interaction.options.getString('special-effect');
    const se = crbSpecialEffects.find(se => seOption?.toLowerCase() === se.name.toLowerCase());

    if (se) {
      await interaction.reply({
        components:[seInfoMessageContainerBuilder(se)],
        flags: MessageFlags.IsComponentsV2 | (interaction.options.getString('show-all') ? 0 : MessageFlags.Ephemeral)
      });

      if (se.name === 'Impale') {
        // Follow up with the Impale Effects Table
        const file = new AttachmentBuilder('./assets/impale-table.png');

        // TODO: Host image online rather than locally
        const embed = new EmbedBuilder().setTitle('Impale Effects Table').setImage('attachment://impale-table.png');
        interaction.followUp({
          embeds: [embed],
          files: [file],
          flags: (interaction.options.getString('show-all') ? undefined : MessageFlags.Ephemeral)
        });
      }
    } else {
      interaction.reply('Special effect does not exist');
    }
  }
};