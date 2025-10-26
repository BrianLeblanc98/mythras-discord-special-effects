import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  Client,
  Collection,
  RepliableInteraction,
  SlashCommandBuilder
} from 'discord.js';

export const ACCENT_COLOR: number = 0xa82516;
export enum LevelsOfSuccess {
  Critical = 4,
  Success = 3,
  Failure = 2,
  Fumble = 1,
}

export type Command = {
  data: SlashCommandBuilder,
  execute(interaction: RepliableInteraction): void,
  autocomplete(interaction: AutocompleteInteraction): void
};

export type ClientWithCommands = Client & {
  commands?: Collection<string, Command>,
};

// Done this way for adding special effects
const specialEffectWeaponTypes = ['Axe', 'Bludgeoning', 'Cutting', 'Entangling', 'Firearm', 'Impaling', 'Ranged', 'Shield', 'Siege', 'Small', 'Two Handed', 'Unarmed'] as const;
export type specialEffectWeaponType = typeof specialEffectWeaponTypes[number];
export const specialEffectWeaponTypeChoices: APIApplicationCommandOptionChoice<string>[] = specialEffectWeaponTypes.map(wt => ({ name: wt, value: wt}));

// TODO: Consider adding optional property imageURL? for effects that have additional tables/etc. like Impale
export interface specialEffect {
  /** Name of the Special Effect */
  name: string;
  /** Description of the Special Effect */
  description: string;
  /** Source of where the Special Effect is from */
  source: string;
  /** True if an attacker can use this Special Effect */
  attacker: boolean;
  /** True if a defender can use this Special Effect */
  defender: boolean;
  /** True if a critical is required to use this Special Effect */
  critRequired: boolean;
  /** True if the opponent is required to fumble to use this Special Effect */
  opponentFumbleRequired: boolean;
  /** True if the Special Effect is stackable */
  stackable: boolean;
  /** Which types of weapon is required to use this Special Effect. Undefined if there's no weapon restriction */
  weaponTypes?: specialEffectWeaponType[];
}
