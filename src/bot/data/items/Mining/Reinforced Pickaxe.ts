import { Item } from "../../../structures/item";

export const ReinforcedPickaxe: Item = {
	name: 'Reinforced Pickaxe',
	emoji: '⛏️',
	description: 'A flimsy pickaxe with some stone strapped on it.',
	category: 'Mining',
	tool: {
		type: 'pickaxe',
		minDamage: 1,
		maxDamage: 4,
		doubleDamageChance: 20,
		power: 2,
		luck: 1,
		durability: 2,
		speed: 1,
	},
	crafting: {
		levelRequirement: 0,
		itemRequirements: [
			{
				item: 'SturdyStick',
				amount: 2,
			},
			{
				item: 'Stone',
				amount: 4,
			},
		]
	}
}