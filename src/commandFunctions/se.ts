import { ContainerBuilder, SeparatorBuilder } from 'discord.js';
import { ACCENT_COLOR, LevelsOfSuccess, specialEffect } from '../util';
import { crbSpecialEffects } from '../data/specialEffects/crb';

function getWinner(attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess): 'Attacker' | 'Defender' | 'Neither' {
  if (attackerLOS === defenderLOS || (attackerLOS <= LevelsOfSuccess.Failure && defenderLOS <= LevelsOfSuccess.Failure)) {
    return 'Neither';
  } else {
    return attackerLOS > defenderLOS ? 'Attacker' : 'Defender';
  }
}

export function getFilteredSpecialEffects(attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess, specialEffects: specialEffect[]): specialEffect[] {
  // Create a filter to determine which special effects are available

  if (getWinner(attackerLOS, defenderLOS) === 'Neither') {
    return [];
  }

  const filter = attackerLOS > defenderLOS ?
    (se: specialEffect) => { // Attacker had the higher level of success
      return se.attacker &&
        !(se.critRequired && attackerLOS !== LevelsOfSuccess.Critical) &&
        !(se.opponentFumbleRequired && defenderLOS !== LevelsOfSuccess.Fumble);
    } :
    (se: specialEffect) => { // Defender had the higher level of success
      return se.defender &&
        !(se.critRequired && defenderLOS !== LevelsOfSuccess.Critical) &&
        !(se.opponentFumbleRequired && attackerLOS !== LevelsOfSuccess.Fumble);
    };

  return specialEffects.filter(filter);
}

export function seContainerBuilder(attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess): ContainerBuilder {
  // Create a map for easier access to String versions of the LOS'
  const los = new Map<LevelsOfSuccess, string>();
  los.set(LevelsOfSuccess.Critical, 'Critical');
  los.set(LevelsOfSuccess.Success, 'Success');
  los.set(LevelsOfSuccess.Failure, 'Failure');
  los.set(LevelsOfSuccess.Fumble, 'Fumble');

  // Start creating the container for the final response
  let seContainerBuilder = new ContainerBuilder().setAccentColor(ACCENT_COLOR);
  const headingText = `__**Attacker ${los.get(attackerLOS)} - Defender ${los.get(defenderLOS)}**__`;

  const winner = getWinner(attackerLOS, defenderLOS);
  // If the levels of success are the same, or the Attacker and Defender both fail/fumble, no special effects are awarded
  if (winner === 'Neither') {
    seContainerBuilder = seContainerBuilder.addTextDisplayComponents(textDisplay => textDisplay.setContent(`${headingText}\nNo special effects awarded`));
  } else {
    // Otherwise, special effects are awarded
    let seList = 'Special effects available:';
    getFilteredSpecialEffects(attackerLOS, defenderLOS, crbSpecialEffects).forEach(se => {
      seList = seList.concat(
        `\n- *${se.name}${se.weaponTypes ? ` - (${se.weaponTypes.toString().replace(',', ', ')} weapons)` : ''}*`
      );
    });

    // Finish creating the component for the final response
    const diff = attackerLOS - defenderLOS;
    const plural = Math.abs(diff) > 1 ? 's' : '';

    seContainerBuilder = seContainerBuilder
      .addTextDisplayComponents(
        textDisplay =>
          textDisplay.setContent(`${headingText}\nThe **${winner}** gets **${Math.abs(diff)}** special effect${plural}`)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay => textDisplay.setContent(seList));
  }

  return seContainerBuilder;
}