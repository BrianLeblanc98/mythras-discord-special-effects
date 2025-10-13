import { RepliableInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('se').setDescription('Opens a modal to help with Mythras Special Effects'),
  async execute(interaction: RepliableInteraction) {
    interaction.reply('pong')
  }
}