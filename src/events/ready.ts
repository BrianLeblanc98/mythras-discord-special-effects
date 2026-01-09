import { Events } from 'discord.js';
import type { ClientWithCommands } from '../util';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: ClientWithCommands) {
		console.log(`ready.js: Ready! Logged in as ${client.user?.tag}`);
	},
};