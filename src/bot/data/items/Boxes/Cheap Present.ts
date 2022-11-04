import { BoxOpenLocations, Item } from "../../../structures/item";

export const CheapPresent: Item = {
	name: 'Cheap Present',
	emoji: '🎁',
	description: 'A low value present recieved if you do well!',
	category: 'Boxes',
	box: {
		levelRequirement: 0,
		openAt: BoxOpenLocations.Personal,
		items: [
			{
				item: 'Pebble',
				minAmount: 1,
				maxAmount: 5,
				chance: 30
			},
			{
				item: 'Stick',
				minAmount: 1,
				maxAmount: 4,
				chance: 30,
			},
			{
				item: 'SturdyStick',
				minAmount: 1,
				maxAmount: 2,
				chance: 15,
			},
			{
				item: 'Stone',
				minAmount: 1,
				maxAmount: 2,
				chance: 10,
			}
		]
	}
}