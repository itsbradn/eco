import { Item } from "../../../structures/item";

export const SturdyStick: Item = {
	name: 'Sturdy Stick',
	emoji: '🌲',
	description: 'A big stick found probably from breaking it off a tree.',
	category: 'Materials',
	crafting: {
		levelRequirement: 0,
		itemRequirements: [
			{
				item: 'Stick',
				amount: 8,
			}
		]
	}
}