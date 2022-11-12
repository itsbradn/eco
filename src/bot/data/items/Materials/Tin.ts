import { Item } from "../../../structures/item";

export const Tin: Item = {
	name: 'Tin',
	emoji: '🪨',
	description: 'A material found relatively commonly in mines.',
	category: 'Materials',
	obtainable: {
		mining: {
			chance: 12,
			powerNeeded: 2,
			minAmount: 2,
			maxAmount: 7,
			minHealth: 4,
			maxHealth: 9,
		}
	},
}