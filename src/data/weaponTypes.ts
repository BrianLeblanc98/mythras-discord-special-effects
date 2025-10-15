import { APIApplicationCommandOptionChoice } from 'discord.js';

export const specialEffectWeaponTypeChoices: APIApplicationCommandOptionChoice<string>[] = [
  { name: 'Axe', value: 'Axe'},
  { name: 'Bludgeoning', value: 'Bludgeoning' },
  { name: 'Cutting', value: 'Cutting' },
  { name: 'Entangling', value: 'Entangling' },
  { name: 'Firearm', value: 'Firearm' },
  { name: 'Impaling', value: 'Impaling' },
  { name: 'Ranged', value: 'Ranged' },
  { name: 'Shield', value: 'Shield' },
  { name: 'Siege', value: 'Siege' },
  { name: 'Small', value: 'Small' },
  { name: 'Two Handed', value: 'Two Handed' },
  { name: 'Unarmed', value: 'Unarmed' }
]