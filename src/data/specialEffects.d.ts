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
  /** Which type of weapon is required to use this Special Effect. Undefined if there's no weapon restriction */
  weaponType?: 'Shield' | 'Bludgeoning' | 'Cutting' | 'Ranged' | 'Siege' | 'Firearm' | 'Entangling' | 'Impaling' | 'Small' | 'Two Handed' | 'Unarmed';
}