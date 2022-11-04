import { Item } from "../../../structures/item";

export const Stone: Item = {
	name: 'Stone',
	emoji: '🪨',
	description: 'A stone found in the wilderness.',
	category: 'Materials',
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