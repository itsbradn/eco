import { Item } from "../../../structures/item";

export const Stone: Item = {
	name: 'Stone',
	emoji: '🪨',
	description: 'A stone found in the wilderness.',
	category: 'Materials',
	obtainable: {
		mining: {
			chance: 20,
			powerNeeded: 1,
			minAmount: 16,
			maxAmount: 22,
			minHealth: 3,
			maxHealth: 5,
		}
	},
	crafting: {
		levelRequirement: 0,
		itemRequirements: [
			{
				item: 'Pebble',
				amount: 15,
			}
		]
	}
}