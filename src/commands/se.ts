import {
  SlashCommandBuilder,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import { crbSpecialEffects } from '../data/specialEffects/crb';
import { LevelsOfSuccess, specialEffect } from '../util';


module.exports = {
  data: new SlashCommandBuilder()
    .setName('se')
    .setDescription('Replies with relevant Special Effect information based on the Levels of Success')
    .addIntegerOption(option =>
      option
        .setName('attacker-los')
        .setDescription('The Attacker\'s Level of Success')
        .setRequired(true)
        .addChoices(
          { name: 'Critical', value: LevelsOfSuccess.Critical },
          { name: 'Success', value: LevelsOfSuccess.Success },
          { name: 'Failure', value: LevelsOfSuccess.Failure },
          { name: 'Fumble', value: LevelsOfSuccess.Fumble }
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
    const los = new Map<number, string>();
    los.set(LevelsOfSuccess.Critical, 'Critical');
    los.set(LevelsOfSuccess.Success, 'Success');
    los.set(LevelsOfSuccess.Failure, 'Failure');
    los.set(LevelsOfSuccess.Fumble, 'Fumble');

    // LOS = Level Of Success
    const attackerLOS = interaction.options.getInteger('attacker-los', true);
    const defenderLOS = interaction.options.getInteger('defender-los', true);

    // Start creating the container for the final response
    let messageContainer = new ContainerBuilder().setAccentColor(0xa82516)
    const headingText = `__**Attacker ${los.get(attackerLOS)} - Defender ${los.get(defenderLOS)}**__`

    // If the levels of success are the same, or the Attacker and Defender both fail/fumble, no special effects are awarded
    if (attackerLOS === defenderLOS || (attackerLOS <= LevelsOfSuccess.Failure && defenderLOS <= LevelsOfSuccess.Failure)) {
      // Finish creating the component for the final response
      messageContainer = messageContainer.addTextDisplayComponents(textDisplay => textDisplay.setContent(`${headingText}\nNo special effects awarded`))
    } else {
      // Otherwise, special effects are awarded
      const winner = attackerLOS > defenderLOS ? 'Attacker' : 'Defender';

      // Create a filter to determine which special effects are available
      const seFilter = winner === 'Attacker' ?
        (se: specialEffect) => { // Attacker had the higher level of success
          return se.attacker && !(se.critRequired && attackerLOS !== LevelsOfSuccess.Critical) && !(se.opponentFumbleRequired && defenderLOS !== LevelsOfSuccess.Fumble)
        } :
        (se: specialEffect) => { // Defender had the higher level of success
          return se.defender && !(se.critRequired && defenderLOS !== LevelsOfSuccess.Critical) && !(se.opponentFumbleRequired && attackerLOS !== LevelsOfSuccess.Fumble);
        };

      // Finish creating the component for the final response
      let seText = 'Special effects available:';
      crbSpecialEffects.filter(seFilter).forEach(se => {
        seText = seText.concat(`\n- *${se.name}${se.weaponTypes ? ` - (${se.weaponTypes.toString().replace(',', ', ')} weapons)` : ''}*`);
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
  }
}