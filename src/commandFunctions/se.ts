import { ContainerBuilder, SeparatorBuilder } from 'discord.js';
import { ACCENT_COLOR, LevelsOfSuccess, specialEffect } from '../util';
import { dbGetGuildSpecialEffects } from '../database';

/**
 * Get the winner based on levels of success
 * @param {LevelsOfSuccess} attackerLOS Attacker's Level of Success
 * @param {LevelsOfSuccess} defenderLOS Defender's Level of Success
 */
function getWinner(attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess): 'Attacker' | 'Defender' | 'Neither' {
	if (attackerLOS === defenderLOS || (attackerLOS <= LevelsOfSuccess.Failure && defenderLOS <= LevelsOfSuccess.Failure)) {
		return 'Neither';
  	}

    return attackerLOS > defenderLOS ? 'Attacker' : 'Defender';
}

/**
 * Returns list of special effects that the winner can use
 * @param guildId 
 * @param attackerLOS Attacker's Level of Success
 * @param defenderLOS Defender's Level of Success
 */
export async function getFilteredSpecialEffects(guildId: string, attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess): Promise<specialEffect[]> {
	if (getWinner(attackerLOS, defenderLOS) === 'Neither') return [];

	const specialEffects = await dbGetGuildSpecialEffects(guildId);

	// Create a filter to determine which special effects are available
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

/**
 * Returns the ContainerBuilder to be used as a component in commands/se.ts
 * @param guildId 
 * @param attackerLOS Attacker's Level of Success
 * @param defenderLOS Defender's Level of Success
 */
export async function seContainerBuilder(guildId: string, attackerLOS: LevelsOfSuccess, defenderLOS: LevelsOfSuccess): Promise<ContainerBuilder> {
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
		const filteredSpecialEffects = await getFilteredSpecialEffects(guildId, attackerLOS, defenderLOS);
		filteredSpecialEffects.forEach(se => {
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