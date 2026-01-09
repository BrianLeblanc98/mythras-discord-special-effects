import {
  SlashCommandBuilder,
  MessageFlags,
  ChatInputCommandInteraction
} from 'discord.js';
import { LevelsOfSuccess } from '../util';
import { seContainerBuilder } from '../commandFunctions/se';

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
				{ name: 'Critical', value: LevelsOfSuccess.Critical },
				{ name: 'Success', value: LevelsOfSuccess.Success },
				{ name: 'Failure', value: LevelsOfSuccess.Failure },
				{ name: 'Fumble', value: LevelsOfSuccess.Fumble }
			)
		)
		.addStringOption(option =>
			option
			.setName('show-all')
			.setDescription('Make the response visible to the whole channel instead of only you')
			.setRequired(false)
			.addChoices({ name: 'True', value: 'True' })
		),
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) throw '/se No guildId';
		const guildId = interaction.guildId;

		// LOS = Level Of Success
		const attackerLOS = interaction.options.getInteger('attacker-los', true);
		const defenderLOS = interaction.options.getInteger('defender-los', true);

		const containerBuilder = await seContainerBuilder(guildId, attackerLOS, defenderLOS);
		interaction.reply({
			components: [containerBuilder],
			flags: MessageFlags.IsComponentsV2 | (interaction.options.getString('show-all') ? 0 : MessageFlags.Ephemeral)
		});
    }
};