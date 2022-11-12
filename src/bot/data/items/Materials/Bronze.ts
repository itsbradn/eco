import { Item } from "../../../structures/item";

export const Bronze: Item = {
	name: 'Bronze',
	emoji: '🪨',
	description: 'A rarer material found in mines but can also be received by crafting tin and bronze together.',
	category: 'Materials',
	obtainable: {
		mining: {
			chance: 18,
			powerNeeded: 3,
			minAmount: 1,
			maxAmount: 5,
			minHealth: 4,
			maxHealth: 9,
		}
	},
	crafting: {
		levelRequirement: 3,
		itemRequirements: [
			{
				item: 'Copper',
				amount: 7
			},
			{
				item: 'Tin',
				amount: 4,
			}
		]
	}
}