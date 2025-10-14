import {
  SlashCommandBuilder,
  ModalBuilder,
  LabelBuilder,
  MessageComponentInteraction,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  SeparatorBuilder
} from 'discord.js';
import { crbSpecialEffects } from '../data/specialEffects/crb';
import { specialEffect } from '../data/specialEffects';

// TODO: Convert this to two option slash command, it lines up better with how se-info is used
module.exports = {
  data: new SlashCommandBuilder().setName('se').setDescription('Opens a modal to '),
  async execute(interaction: MessageComponentInteraction) {
    const attackerCustomId = 'attackerLevelOfSuccess';
    const defenderCustomId = 'defenderLevelOfSuccess';

    // Create the modal with a customId based on interaction id
    const modalCustomId = `seModal_${interaction.id}`;

    // Set up levels of success as numbers for easier comparisons
    const levelsOfSuccess = new Map<number, string>();
    levelsOfSuccess.set(4, 'Critical');
    levelsOfSuccess.set(3, 'Success');
    levelsOfSuccess.set(2, 'Failure');
    levelsOfSuccess.set(1, 'Fumble');

    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle('Mythras Special Effects');

    // Create the level of success options
    const options: StringSelectMenuOptionBuilder[] = [];
    for (const level of levelsOfSuccess) {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(level[1])
        .setValue(level[0].toString());
      options.push(option);
    }

    // Create a Label with a StringSelectMenu inside for the Attacker and Defender
    const attackerSelectMenuLabel = new LabelBuilder()
      .setLabel('Attacker\'s level of success')
      .setStringSelectMenuComponent(selectMenu => selectMenu.setCustomId(attackerCustomId).addOptions(options));
    const defenderSelectMenuLabel = new LabelBuilder()
      .setLabel('Defender\'s level of success')
      .setStringSelectMenuComponent(selectMenu => selectMenu.setCustomId(defenderCustomId).addOptions(options));

    // Add both Labels to the modal
    modal.addLabelComponents(attackerSelectMenuLabel, defenderSelectMenuLabel);
    await interaction.showModal(modal);

    try {
      // https://stackoverflow.com/questions/77286277/unknown-interaction-error-with-discord-js-v14-after-cancelling-and-retrying-a-mo
      const result = await interaction.awaitModalSubmit({
        time: 10_000,
        filter: i => i.customId === modalCustomId
      });

      // LOS = Level Of Success
      const attackerLOS = parseInt(result.fields.getStringSelectValues(attackerCustomId)[0]);
      const defenderLOS = parseInt(result.fields.getStringSelectValues(defenderCustomId)[0]);

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

      result.reply({
        components: [messageContainer],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (err) {
      console.log('se modal timeout');
    }
  }
}