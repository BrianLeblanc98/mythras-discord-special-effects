import {
	AutocompleteInteraction,
	Client,
	ClientOptions,
	Collection,
	RepliableInteraction,
	SlashCommandBuilder
} from 'discord.js';

/** Used for DisplayComponent based messages, specifically `new ContainerBuilder().setAccentColor(ACCENT_COLOR)` */
export const ACCENT_COLOR: number = 0xa82516;

/** Represents the different levels of success using numbers for easier comparisons */
export enum LevelsOfSuccess {
	Critical = 4,
	Success = 3,
	Failure = 2,
	Fumble = 1,
}

/** Type to describe a command */
export type Command = {
	data: SlashCommandBuilder;
	execute(interaction: RepliableInteraction): void | Promise<void>;
	autocomplete?(interaction: AutocompleteInteraction): void | Promise<void>;
};

export function isCommand(command: object): command is Command {
	return (
		'data' in command &&
		command.data instanceof SlashCommandBuilder &&
		'execute' in command &&
		typeof command.execute === 'function'
	);
} 

/** Extend discord.js Client to add commands property */
export class ClientWithCommands extends Client {
  	commands: Collection<string, Command>;
	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection<string, Command>();

	}
}

// TODO: Consider adding optional property imageURL? for effects that have additional tables/etc. like Impale
/**
 * Represents a Special Effect
 * @property {string} guildId - Guild that the command is associated with, only used by the database
 * @property {string} name - Name of the Special Effect
 * @property {string} description - Description of the Special Effect
 * @property {string} source - Source of where the Special Effect is from
 * @property {booelan} attacker - True if an attacker can use this Special Effect
 * @property {boolean} defender - True if a defender can use this Special Effect
 * @property {boolean} critRequired - True if a critical is required to use this Special Effect
 * @property {boolean} opponentFumbleRequired - True if the opponent is required to fumble to use this Special Effect
 * @property {boolean} stackable - True if the Special Effect is stackable
 * @property {string} [weaponTypesCSV] - Which types of weapon is required to use this Special Effect. Undefined if there's no weapon restriction
*/
export type specialEffect = {
	guildId: string;
	name: string;
	description: string;
	source: string;
	attacker: boolean;
	defender: boolean;
	critRequired: boolean;
	opponentFumbleRequired: boolean;
	stackable: boolean;
	weaponTypes?: string;
};

export function isSpecialEffect(obj: object): obj is specialEffect {
	return(
		'guildId' in obj &&
		'name' in obj &&
		'description' in obj &&
		'source' in obj &&
		'attacker' in obj &&
		'defender' in obj &&
		'critRequired' in obj &&
		'opponentFumbleRequired' in obj &&
		'stackable' in obj
	);
}

/**
 * Represents a set of specialEffects; For the purpose of importing specialEffects from disk on startup
 * @property {string} source Source of the specialEffects. This will override the source property of every item in specialEffects
 * @property {specialEffect[]} specialEffects Array of specialEffects to
*/
export type specialEffectSet = {
	source: string;
	specialEffects: specialEffect[]
};

export function isSpecialEffectSet(obj: object): obj is specialEffectSet {
	return ('source' in obj && 'specialEffects' in obj);
}