import type { ClientWithCommands } from '../types/util'
import { Events } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: ClientWithCommands) {
		console.log(`ready.js: Ready! Logged in as ${client.user?.tag}`);
	},
};