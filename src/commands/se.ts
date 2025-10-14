import {
  SlashCommandBuilder,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import { crbSpecialEffects } from '../data/specialEffects/crb';
import { specialEffect } from '../data/specialEffects';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se')
    .setDescription('a')
    .addIntegerOption(option =>
      option
        .setName('attacker-los')
        .setDescription('The Attacker\'s Level of Success')
        .setRequired(true)
        .addChoices(
          { name: 'Critical', value: 4 },
          { name: 'Success', value: 3 },
          { name: 'Failure', value: 2 },
          { name: 'Fumble', value: 1 }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('defender-los')
        .setDescription('The Defender\'s Level of Success')
        .setRequired(true)
        .addChoices(
          { name: 'Critical', value: 4 },
          { name: 'Success', value: 3 },
          { name: 'Failure', value: 2 },
          { name: 'Fumble', value: 1 }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    // Set up levels of success as numbers for easier comparisons
    const levelsOfSuccess = new Map<number, string>();
    levelsOfSuccess.set(4, 'Critical');
    levelsOfSuccess.set(3, 'Success');
    levelsOfSuccess.set(2, 'Failure');
    levelsOfSuccess.set(1, 'Fumble');

    // LOS = Level Of Success
    const attackerLOS = interaction.options.getInteger('attacker-los');
    const defenderLOS = interaction.options.getInteger('defender-los');

    if (attackerLOS && defenderLOS) {
      // Start creating the container for the final response
      let messageContainer = new ContainerBuilder().setAccentColor(0xa82516)
      const headingText = `__**Attacker ${levelsOfSuccess.get(attackerLOS)} - Defender ${levelsOfSuccess.get(defenderLOS)}**__`

      // If the levels of success are the same, or the Attacker and Defender both fail/fumble, no special effects are awarded
      if (attackerLOS === defenderLOS || (attackerLOS <= 2 && defenderLOS <= 2)) {
        // Finish creating the component for the final response
        messageContainer = messageContainer.addTextDisplayComponents(textDisplay => textDisplay.setContent(`${headingText}\nNo special effects awarded`))
      } else {
        // Otherwise, special effects are awarded
        const winner = attackerLOS > defenderLOS ? 'Attacker' : 'Defender';

        // Create a filter to determine which special effects are available
        const seFilter = winner === 'Attacker' ?
          (se: specialEffect) => { // Attacker had the higher level of success
            return se.attacker && !(se.critRequired && attackerLOS !== 4) && !(se.opponentFumbleRequired && defenderLOS !== 1)
          } :
          (se: specialEffect) => { // Defender had the higher level of success
            return se.defender && !(se.critRequired && defenderLOS !== 4) && !(se.opponentFumbleRequired && attackerLOS !== 1);
          };

        // Finish creating the component for the final response
        let seText = 'Special effects available:';
        crbSpecialEffects.filter(seFilter).forEach(se => {
          seText = seText.concat(`\n- *${se.name}*`);
        });
        const diff = attackerLOS - defenderLOS;
        const plural = Math.abs(diff) > 1 ? 's' : '';
        messageContainer = messageContainer
          .addTextDisplayComponents(textDisplay => textDisplay.setContent(`${headingText}\nThe **${winner}** gets **${Math.abs(diff)}** special effect${plural}`))
          .addSeparatorComponents(new SeparatorBuilder())
          .addTextDisplayComponents(textDisplay => textDisplay.setContent(seText))
      }

      interaction.reply({
        components: [messageContainer],
        flags: MessageFlags.IsComponentsV2
      });
    } else {
      // TODO: Send better reply than this
      interaction.reply('se.js: Something went wrong')
    }
  }
}