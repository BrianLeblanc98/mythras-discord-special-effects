import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { getFilteredSpecialEffects } from './se';
import { LevelsOfSuccess } from '../util';

// TODO: Fix this, create a test.db
describe('getFilteredSpecialEffects', () => {
	// Neither win
	it('attacker and defender both get failure or fumble', () => {
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Fumble,LevelsOfSuccess.Fumble, crbSpecialEffects).length,
			0,
			'attacker fumble, defender fumble: expected empty array'
		);
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Failure,LevelsOfSuccess.Fumble, crbSpecialEffects).length,
			0,
			'attacker failure, defender fumble: expected empty array'
		);
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Fumble,LevelsOfSuccess.Failure, crbSpecialEffects).length,
			0,
			'attacker fumble, defender failure: expected empty array'
		);
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Failure,LevelsOfSuccess.Failure, crbSpecialEffects).length,
			0,
			'attacker failure, defender failure: expected empty array'
		);
	});

	it('attacker and defender both get success or critical', () => {
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Success,LevelsOfSuccess.Success, crbSpecialEffects).length,
			0,
			'attacker success, defender success: expected empty array'
		);
		assert.equal(
			getFilteredSpecialEffects(LevelsOfSuccess.Critical,LevelsOfSuccess.Critical, crbSpecialEffects).length,
			0,
			'attacker critical, defender critical: expected empty array'
		);
	});


	// Attacker wins
	const attackerCritical_defenderFumble = getFilteredSpecialEffects(LevelsOfSuccess.Critical,LevelsOfSuccess.Fumble, crbSpecialEffects);
	it('attacker critical, defender fumble', () => {
		assert.equal(attackerCritical_defenderFumble.every(se => se.attacker),
			true,
			'expected every attacker'
		);
		assert.equal(
			attackerCritical_defenderFumble.some(se => se.critRequired)
			,true
			,'expected some critRequired'
		);
		assert.equal(
			attackerCritical_defenderFumble.some(se => se.opponentFumbleRequired)
			,true
			,'expected some opponentFumbleRequired'
		);
	});

	const attackerCritical_defenderFailure = getFilteredSpecialEffects(LevelsOfSuccess.Critical,LevelsOfSuccess.Failure, crbSpecialEffects);
	it('attacker critical, defender failure', () => {
		assert.equal(attackerCritical_defenderFailure.every(se => se.attacker),
			true,
			'expected every attacker'
		);
		assert.equal(
		attackerCritical_defenderFailure.some(se => se.critRequired)
			,true
			,'expected some critRequired'
		);
		assert.equal(
			attackerCritical_defenderFailure.some(se => se.opponentFumbleRequired)
			,false
			,'expected no opponentFumbleRequired'
		);
	});

	const attackerCritical_defenderSuccess = getFilteredSpecialEffects(LevelsOfSuccess.Critical,LevelsOfSuccess.Success, crbSpecialEffects);
	it('attacker critical, defender success', () => {
		assert.equal(attackerCritical_defenderSuccess.every(se => se.attacker),
			true,
			'expected every attacker'
		);
		assert.equal(
			attackerCritical_defenderSuccess.some(se => se.critRequired)
			,true
			,'expected some critRequired'
		);
		assert.equal(
			attackerCritical_defenderSuccess.some(se => se.opponentFumbleRequired)
			,false
			,'expected no opponentFumbleRequired'
		);
	});

	const attackerSuccess_defenderFumble = getFilteredSpecialEffects(LevelsOfSuccess.Success,LevelsOfSuccess.Fumble, crbSpecialEffects);
	it('attacker success, defender fumble', () => {
		assert.equal(attackerSuccess_defenderFumble.every(se => se.attacker),
			true,
			'expected every attacker'
		);
		assert.equal(
			attackerSuccess_defenderFumble.some(se => se.critRequired)
			,false
			,'expected no critRequired'
		);
		assert.equal(
			attackerSuccess_defenderFumble.some(se => se.opponentFumbleRequired)
			,true
			,'expected some opponentFumbleRequired'
		);
	});

	const attackerSuccess_defenderFailure = getFilteredSpecialEffects(LevelsOfSuccess.Success,LevelsOfSuccess.Failure, crbSpecialEffects);
	it('attacker success, defender failure', () => {
		assert.equal(attackerSuccess_defenderFailure.every(se => se.attacker),
			true,
			'expected every attacker'
		);
		assert.equal(
			attackerSuccess_defenderFailure.some(se => se.critRequired)
			,false
			,'expected no critRequired'
		);
		assert.equal(
			attackerSuccess_defenderFailure.some(se => se.opponentFumbleRequired)
			,false
			,'expected no opponentFumbleRequired'
		);
	});


	// Defender wins
	const attackerFumble_defenderCritical = getFilteredSpecialEffects(LevelsOfSuccess.Fumble, LevelsOfSuccess.Critical, crbSpecialEffects);
	it('attacker fumble, defender critical', () => {
		assert.equal(attackerFumble_defenderCritical.every(se => se.defender),
			true,
			'expected every defender'
		);
		assert.equal(attackerFumble_defenderCritical.some(se => se.critRequired),
			true,
			'expected some critRequired'
		);
		assert.equal(attackerFumble_defenderCritical.some(se => se.opponentFumbleRequired),
			true,
			'expected some opponentFumbleRequired'
		);
	});

	const attackerFailure_defenderCritical = getFilteredSpecialEffects(LevelsOfSuccess.Failure, LevelsOfSuccess.Critical, crbSpecialEffects);
	it('attacker failure, defender critical', () => {
		assert.equal(attackerFailure_defenderCritical.every(se => se.defender),
			true,
			'expected every defender'
		);
		assert.equal(attackerFailure_defenderCritical.some(se => se.critRequired),
			true,
			'expected some critRequired'
		);
		assert.equal(attackerFailure_defenderCritical.some(se => se.opponentFumbleRequired),
			false,
			'expected no opponentFumbleRequired'
		);
	});

	const attackerSuccess_defenderCritical = getFilteredSpecialEffects(LevelsOfSuccess.Success, LevelsOfSuccess.Critical, crbSpecialEffects);
	it('attacker success, defender critical', () => {
		assert.equal(attackerSuccess_defenderCritical.every(se => se.defender),
			true,
			'expected every defender'
		);
		assert.equal(attackerSuccess_defenderCritical.some(se => se.critRequired),
			true,
			'expected some critRequired'
		);
		assert.equal(attackerSuccess_defenderCritical.some(se => se.opponentFumbleRequired),
			false,
			'expected no opponentFumbleRequired'
		);
	});

	const attackerFumble_defenderSuccess = getFilteredSpecialEffects(LevelsOfSuccess.Fumble, LevelsOfSuccess.Success, crbSpecialEffects);
	it('attacker fumble, defender success', () => {
		assert.equal(attackerFumble_defenderSuccess.every(se => se.defender),
			true,
			'expected every defender'
		);
		assert.equal(attackerFumble_defenderSuccess.some(se => se.critRequired),
			false,
			'expected no critRequired'
		);
		assert.equal(attackerFumble_defenderSuccess.some(se => se.opponentFumbleRequired),
			true,
			'expected some opponentFumbleRequired'
		);
	});

	const attackerFailure_defenderSuccess = getFilteredSpecialEffects(LevelsOfSuccess.Failure, LevelsOfSuccess.Success, crbSpecialEffects);
	it('attacker failure, defender success', () => {
		assert.equal(attackerFailure_defenderSuccess.every(se => se.defender),
			true,
			'expected every defender'
		);
		assert.equal(attackerFailure_defenderSuccess.some(se => se.critRequired),
			false,
			'expected no critRequired'
		);
		assert.equal(attackerFailure_defenderSuccess.some(se => se.opponentFumbleRequired),
			false,
			'expected no opponentFumbleRequired'
		);
	});
});