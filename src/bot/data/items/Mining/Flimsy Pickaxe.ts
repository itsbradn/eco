import { Item } from '../../../structures/item';

export const FlimsyPickaxe: Item = {
	name: 'Flimsy Pickaxe',
	emoji: '⛏️',
	description: 'A flimsy pickaxe that can break some ores.',
	category: 'Mining',
	tool: {
		type: 'pickaxe',
		minDamage: 2,
		maxDamage: 3,
		doubleDamageChance: 15,
		power: 1,
		luck: 1,
		durability: 1,
		speed: 1,
	},
	crafting: {
		levelRequirement: 0,
		itemRequirements: [
			{
				item: 'Stick',
				amount: 3,
			},
			{
				item: 'Pebble',
				amount: 9,
			},
		],
	},
};
