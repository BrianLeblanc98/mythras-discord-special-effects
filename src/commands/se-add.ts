import {
  ChatInputCommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputStyle
} from 'discord.js';

import {
  specialEffect,
  specialEffectWeaponType,
  seInfoMessageContainerBuilder,
  specialEffectWeaponTypeChoices
} from '../util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se-add')
    .setDescription('[Non-functional] - Add a Special Effect.')
    .addBooleanOption(option =>
      option
        .setRequired(true)
        .setName('attacker')
        .setDescription('Useable when attacking?')
    )
    .addBooleanOption(option =>
      option
        .setRequired(true)
        .setName('defender')
        .setDescription('Useable when defending?')
    )
    .addBooleanOption(option =>
      option
        .setRequired(true)
        .setName('crit-required')
        .setDescription('Critical required?')
    )
    .addBooleanOption(option =>
      option
        .setRequired(true)
        .setName('opponent-fumble-required')
        .setDescription('Opponent fumble required?')
    )
    .addBooleanOption(option =>
      option
        .setRequired(true)
        .setName('stackable')
        .setDescription('Stackable?')
    )
    .addStringOption(option =>
      option
        .setRequired(false)
        .setName('weapon-type')
        .setDescription('Optional: Which weapon type is required to use this Special Effect')
        .addChoices(specialEffectWeaponTypeChoices)
    )
    .addStringOption(option =>
      option
        .setRequired(false)
        .setName('weapon-type2')
        .setDescription('Optional: Which weapon type is required to use this Special Effect')
        .addChoices(specialEffectWeaponTypeChoices)
    )
    .addStringOption(option =>
      option
        .setRequired(false)
        .setName('weapon-type3')
        .setDescription('Optional: Which weapon type is required to use this Special Effect')
        .addChoices(specialEffectWeaponTypeChoices)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    // Create the modal with a customId based on interaction id
    const modalCustomId = `se-add-modal-${interaction.id}`;
    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle('Final steps');

    const l1 = new LabelBuilder()
      .setLabel('Name')
      .setTextInputComponent(textInput =>
        textInput
          .setRequired(true)
          .setCustomId('name')
          .setPlaceholder('Name of the Special Effect')
          .setStyle(TextInputStyle.Short)
      );

    const l2 = new LabelBuilder()
      .setLabel('Description')
      .setTextInputComponent(textInput =>
        textInput
          .setRequired(true)
          .setCustomId('description')
          .setPlaceholder('Description of the Special Effect')
          .setStyle(TextInputStyle.Paragraph)
      );

    const l3 = new LabelBuilder()
      .setLabel('Source')
      .setTextInputComponent(textInput =>
        textInput
        .setRequired(true)
          .setCustomId('source')
          .setPlaceholder('Source of the Special Effect')
          .setStyle(TextInputStyle.Short)
      );

    modal.addLabelComponents(l1, l2, l3);
    await interaction.showModal(modal);

    try {
      // https://stackoverflow.com/questions/77286277/unknown-interaction-error-with-discord-js-v14-after-cancelling-and-retrying-a-mo
      const result = await interaction.awaitModalSubmit({
        time: 60_000,
        filter: i => i.customId === modalCustomId
      });

      const name = result.fields.getTextInputValue('name');
      const description = result.fields.getTextInputValue('description');
      const source = result.fields.getTextInputValue('source');
      const attacker = interaction.options.getBoolean('attacker', true);
      const defender = interaction.options.getBoolean('defender', true);
      const critRequired = interaction.options.getBoolean('crit-required', true);
      const opponentFumbleRequired = interaction.options.getBoolean('opponent-fumble-required', true);
      const stackable = interaction.options.getBoolean('stackable', true);
      const weaponType = interaction.options.getString('weapon-type');
      const weaponType2 = interaction.options.getString('weapon-type2');
      const weaponType3 = interaction.options.getString('weapon-type3');

      const newSe: specialEffect = {
        name,
        description,
        source,
        attacker,
        defender,
        critRequired,
        opponentFumbleRequired,
        stackable
      }

      let weaponTypes: specialEffectWeaponType[] = [];

      for (const wt of [weaponType, weaponType2, weaponType3] as specialEffectWeaponType[]) {
        if (wt) weaponTypes.push(wt);
      }

      if (weaponTypes.length > 0) newSe.weaponTypes = weaponTypes;

      // TODO: Connect to a real database and send newSe to that with Guild ID
      result.reply({
        components:[seInfoMessageContainerBuilder(newSe)],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (err) {
      if (err instanceof DiscordjsError && err.code === DiscordjsErrorCodes.InteractionCollectorError) {
        // Ignore
      } else {
        console.log(err);
      }
    }
  }
}