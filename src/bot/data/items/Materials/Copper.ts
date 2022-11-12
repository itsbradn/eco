import { Item } from "../../../structures/item";

export const Copper: Item = {
	name: 'Copper',
	emoji: '🪨',
	description: 'A material found relatively commonly in mines.',
	category: 'Materials',
	obtainable: {
		mining: {
			chance: 15,
			powerNeeded: 2,
			minAmount: 3,
			maxAmount: 6,
			minHealth: 5,
			maxHealth: 7,
		}
	},
}