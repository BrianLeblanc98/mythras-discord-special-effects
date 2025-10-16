import {
  APIApplicationCommandOptionChoice,
  AutocompleteInteraction,
  Client,
  Collection,
  ContainerBuilder,
  RepliableInteraction,
  SlashCommandBuilder
} from 'discord.js';

export type Command = {
  data: SlashCommandBuilder,
  execute(interaction: RepliableInteraction): void,
  autocomplete(interaction: AutocompleteInteraction): void
}

export type ClientWithCommands = Client & {
  commands?: Collection<string, Command>,
}

const specialEffectWeaponTypes = ['Axe', 'Bludgeoning', 'Cutting', 'Entangling', 'Firearm', 'Impaling', 'Ranged', 'Shield', 'Siege', 'Small', 'Two Handed', 'Unarmed'] as const;
export type specialEffectWeaponType = typeof specialEffectWeaponTypes[number];
export const specialEffectWeaponTypeChoices: APIApplicationCommandOptionChoice<string>[] = specialEffectWeaponTypes.map(wt => ({ name: wt, value: wt}))

export enum LevelsOfSuccess {
  Critical = 4,
  Success = 3,
  Failure = 2,
  Fumble = 1,
}

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

/** Create the info message for se-info, can be useful outside that command */
export function seInfoMessageContainerBuilder(se: specialEffect): ContainerBuilder {
  const yesno = (v: boolean) => v ? '**Yes**' : '**No**';
  const infoText =
    `*Usable when*\n- *Attacking:* ${yesno(se.attacker)}\n- *Defending:* ${yesno(se.defender)}\n` +
    `*Weapon type:* ${se.weaponTypes ? `**${se.weaponTypes.toString().replace(',', ', ')}**\n` : '**Any**\n'}` +
    `*Stackable:* ${yesno(se.stackable)}\n` +
    `*Critical only:* ${yesno(se.critRequired)}\n` +
    `*Opponent fumble only:* ${yesno(se.opponentFumbleRequired)}\n`;

  return new ContainerBuilder()
    .setAccentColor(0xa82516)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(`## ${se.name} - ${se.source}##`))
    .addSeparatorComponents(separator => separator)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(`**__Description__**\n${se.description}`))
    .addSeparatorComponents(separator => separator)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(infoText));
}