import {
  ChatInputCommandInteraction,
  ContainerBuilder,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputStyle
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se-add')
    .setDescription('Add a Special Effect')
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
    .addStringOption(option =>
      option
        .setRequired(false)
        .setName('weapon-type')
        .setDescription('Optional: Which weapon type is required to use this Special Effect')
        .addChoices(
          { name: 'Shield', value: 'Shield' },
          { name: 'Bludgeoning', value: 'Bludgeoning' },
          { name: 'Cutting', value: 'Cutting' },
          { name: 'Ranged', value: 'Ranged' },
          { name: 'Siege', value: 'Siege' },
          { name: 'Firearm', value: 'Firearm' },
          { name: 'Entangling', value: 'Entangling' },
          { name: 'Impaling', value: 'Impaling' },
          { name: 'Small', value: 'Small' },
          { name: 'Two Handed', value: 'Two Handed' },
          { name: 'Unarmed', value: 'Unarmed' }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    // Create the modal with a customId based on interaction id
    const modalCustomId = `se-add-modal-${interaction.id}`;
    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle('Add Special Effects');

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
      const weaponType = interaction.options.getString('weapon-type');

      result.reply(`${name}, ${description}, ${source}, ${attacker}, ${defender}, ${critRequired}, ${opponentFumbleRequired}, ${weaponType}`)
      // let messageContainer = new ContainerBuilder().setAccentColor(0xa82516)

      // result.reply({
      //   components: [messageContainer],
      //   flags: MessageFlags.IsComponentsV2
      // });
    } catch (err) {
      console.log('se-add.js: Modal timeout');
    }
  }
}