import { ContainerBuilder } from 'discord.js';
import { ACCENT_COLOR, specialEffect } from '../util';

/** Create the info message for se-info, can be useful outside just /se-info */
export function seInfoContainerBuilder(se: specialEffect): ContainerBuilder {
  const yesno = (v: boolean) => v ? '**Yes**' : '**No**';
  const infoText =
    `*Usable when*\n- *Attacking:* ${yesno(se.attacker)}\n- *Defending:* ${yesno(se.defender)}\n` +
    `*Weapon type:* ${se.weaponTypes ? `**${se.weaponTypes.toString().replace(',', ', ')}**\n` : '**Any**\n'}` +
    `*Stackable:* ${yesno(se.stackable)}\n` +
    `*Critical only:* ${yesno(se.critRequired)}\n` +
    `*Opponent fumble only:* ${yesno(se.opponentFumbleRequired)}\n`;

  return new ContainerBuilder()
    .setAccentColor(ACCENT_COLOR)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(`## ${se.name} - ${se.source}##`))
    .addSeparatorComponents(separator => separator)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(`**__Description__**\n${se.description}`))
    .addSeparatorComponents(separator => separator)
    .addTextDisplayComponents(textDisplay => textDisplay.setContent(infoText));
}