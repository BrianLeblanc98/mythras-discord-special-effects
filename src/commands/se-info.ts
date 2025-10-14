import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SlashCommandBuilder
} from 'discord.js'
import { crbSpecialEffects } from '../data/specialEffects/crb';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se-info')
    .setDescription('Replies with the description of a Special Effect, along with more info')
    .addStringOption(option =>
      option.setName('special-effect')
        .setDescription('The Special Effect you want information about')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused();
    const seNames = crbSpecialEffects.map(se => se.name);
    const filtered = seNames.filter((choice) => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
	},
  async execute(interaction: ChatInputCommandInteraction) {
    const seOption = interaction.options.getString('special-effect');
    const se = crbSpecialEffects.find(se => seOption?.toLowerCase() === se.name.toLowerCase())
    if (se) {
      const yesno = (v: boolean) => v ? '**Yes**' : '**No**';
      const infoText =
        `*Usable when*\n- *Attacking:* ${yesno(se.attacker)}\n- *Defending:* ${yesno(se.defender)}\n` +
        `*Weapon type: * `.concat(se.weaponType !== undefined ? `**${se.weaponType}**\n` : '**Any**\n') +
        `*Stackable:* ${yesno(se.stackable)}\n` +
        `*Critical only:* ${yesno(se.attacker)}\n` +
        `*Opponent fumble only:* ${yesno(se.opponentFumbleRequired)}\n`;

      const messageContainer = new ContainerBuilder()
        .setAccentColor(0xa82516)
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(`## ${se.name} - ${se.source}##`))
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(`**__Description__**\n${se.description}`))
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(textDisplay => textDisplay.setContent(infoText))
      interaction.reply({
        components: [messageContainer],
        flags: MessageFlags.IsComponentsV2
      });
    } else {
      interaction.reply('Special effect does not exist')
    }
  }
}