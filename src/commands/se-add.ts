import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('se-add')
    .setDescription('Opens a modal to add a Special Effect'),
  async execute(interaction: ChatInputCommandInteraction) {

  }
}