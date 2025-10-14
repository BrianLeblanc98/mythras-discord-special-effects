import { specialEffect } from '../specialEffects';

export const crbSpecialEffects: specialEffect[] = [
  {
    name: 'Accidental Injury',
    description: 'The defender deflects or twists an opponent\'s attack in such a way that he fumbles, injuring himself. The attacker must roll damage against himself in a random hit location using the weapon used to strike. If unarmed he tears or breaks something internal, the damage roll ignoring any armour.',
    source: 'CRB',
    attacker: false,
    defender: true,
    critRequired: false,
    opponentFumbleRequired: true,
    stackable: false
  },
  {
    name: 'Arise',
    description: 'Allows the defender to use a momentary opening to roll back up to their feet.',
    source: 'CRB',
    attacker: false,
    defender: true,
    critRequired: false,
    opponentFumbleRequired: false,
    stackable: false
  },
  {
    name: 'Bash',
    description: 'The attacker deliberately bashes the opponent off balance. How far the defender totters back or sideward depends on the weapon being used. Shields knock an opponent back one metre per for every two points of damage rolled (prior to any subtractions due to armour, parries, and so forth), whereas bludgeoning weapons knock back one metre per for every three points. Bashing works only on creatures up to twice the attacker’s SIZ. If the recipient is forced backwards into an obstacle, then they must make a Hard Athletics or Acrobatics skill roll to avoid falling or tripping over.',
    source: 'CRB',
    attacker: true,
    defender: false,
    critRequired: false,
    opponentFumbleRequired: false,
    stackable: false,
    weaponType: 'Bludgeoning'
  },
  {
    name: 'Bleed',
    description: 'The attacker can attempt to cut open a major blood vessel. If the blow overcomes Armour Points and injures the target, the defender must make an opposed roll of Endurance against the original attack roll. If the defender fails, then they begin to bleed profusely. At the start of each Combat Round the recipient loses one level of Fatigue, until they collapse and possibly die. Bleeding wounds can be staunched by passing a First Aid skill roll, but the recipient can no longer perform any strenuous or violent action without re-opening the wound. See Blood Loss CRB pg. 71.',
    source: 'CRB',
    attacker: true,
    defender: false,
    critRequired: false,
    opponentFumbleRequired: false,
    stackable: false,
    weaponType: 'Cutting'
  },
  {
    name: 'Blind Opponent',
    description: 'On a critical the defender briefly blinds his opponent by throwing sand, reflecting sunlight off his shield, or some other tactic which briefly interferes with the attacker\'s vision. The attacker must make an opposed roll of his Evade skill (or Weapon style if using a shield) against the defender\'s original parry roll. If the attacker fails he suffers the Blindness situational modifier for the next 1d3 turns.',
    source: 'CRB',
    attacker: false,
    defender: true,
    critRequired: true,
    opponentFumbleRequired: false,
    stackable: false,
  },
  {
    name: 'Bypass Armour',
    description: 'On a critical the attacker finds a gap in the defender\'s natural or worn armour. If the defender is wearing armour above natural protection, then the attacker must decide which of the two is bypassed. This effect can be stacked to bypass both. For the purposes of this effect, physical protection gained from magic is considered as being worn armour.',
    source: 'CRB',
    attacker: true,
    defender: false,
    critRequired: true,
    opponentFumbleRequired: false,
    stackable: true,
  }
]