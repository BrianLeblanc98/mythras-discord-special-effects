import {
  SlashCommandBuilder,
  ModalBuilder,
  LabelBuilder,
  MessageComponentInteraction,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('se').setDescription('Opens a modal to help with Mythras Special Effects'),
  async execute(interaction: MessageComponentInteraction) {
    const attackerCustomId = 'attackerLevelOfSuccess';
    const defenderCustomId = 'defenderLevelOfSuccess';
    const modalCustomId = `seModal_${interaction.id}`;
    const levelsOfSuccess = ['Critical', 'Success', 'Failure', 'Fumble'];

    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle('Mythras Special Effects');

    const options: StringSelectMenuOptionBuilder[] = [];
    for (const level of levelsOfSuccess) {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(level)
        .setValue(level);
      options.push(option);
    }

    const attackerSelectMenuLabel = new LabelBuilder()
      .setLabel('Attacker\'s level of success')
      .setStringSelectMenuComponent(new StringSelectMenuBuilder().setCustomId(attackerCustomId).addOptions(options));
    const defenderSelectMenuLabel = new LabelBuilder()
      .setLabel('Defender\'s level of success')
      .setStringSelectMenuComponent(new StringSelectMenuBuilder().setCustomId(defenderCustomId).addOptions(options));

    modal.addLabelComponents(attackerSelectMenuLabel, defenderSelectMenuLabel);
    await interaction.showModal(modal);

    try {
      // https://stackoverflow.com/questions/77286277/unknown-interaction-error-with-discord-js-v14-after-cancelling-and-retrying-a-mo
      const result = await interaction.awaitModalSubmit({
        time: 10_000,
        filter: i => i.customId === modalCustomId
      });

      const attackerLOS = result.fields.getStringSelectValues(attackerCustomId)[0];
      const defenderLOS = result.fields.getStringSelectValues(defenderCustomId)[0];

      const messageStart = `The attacker got a ${attackerLOS} and the defender got a ${defenderLOS}`;
      if (attackerLOS === defenderLOS) {
        result.reply(`The attacker and defender both got a ${attackerLOS}, no special effects awarded.`);
      } else if (attackerLOS === 'Failure' && defenderLOS === 'Fumble' || attackerLOS === 'Fumble' && defenderLOS === 'Failure') {
        result.reply(`${messageStart}, no special effects awarded.`)
      } else if (attackerLOS === 'Critical') {
        // TODO: Show relevant special effects
        if (defenderLOS === 'Success') {
          result.reply(`${messageStart}, the attacker gets 1 special effect`);
        } else if (defenderLOS === 'Failure') {
          result.reply(`${messageStart}, the attacker gets 2 special effects`);
        } else if (defenderLOS === 'Fumble') {
          result.reply(`${messageStart}, the attacker gets 3 special effects`);
        }
      } else if (defenderLOS === 'Critical') {
        // TODO: Show relevant special effects
        if (attackerLOS === 'Success') {
          result.reply(`${messageStart}, the defender gets 1 special effect`);
        } else if (attackerLOS === 'Failure') {
          result.reply(`${messageStart}, the defender gets 2 special effects`);
        } else if (attackerLOS === 'Fumble') {
          // Could be just else?
          result.reply(`${messageStart}, the defender gets 3 special effects`);
        }
      } else if (attackerLOS === 'Success') {
        if (defenderLOS === 'Failure') {
          result.reply(`${messageStart}, the attacker gets 1 special effect`)
        } else if (defenderLOS === 'Fumble') {
          result.reply(`${messageStart}, the attacker gets 2 special effects`);
        }
      } else if (defenderLOS === 'Success') {
        if (attackerLOS === 'Failure') {
          result.reply(`${messageStart}, the defender gets 1 special effect`)
        } else if (attackerLOS === 'Fumble') {
          result.reply(`${messageStart}, the defender gets 2 special effects`);
        }
      } else {
        result.reply('temp')
      }
    } catch (err) {
      console.log('se modal timeout');
    }
  }
}