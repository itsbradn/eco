import { BoxOpenLocations, Item } from '../../../structures/item';

export const Artifact: Item = {
	name: 'Artifact',
	emoji: '🥮',
	description: 'A rare artifact found deep in the mines.',
	category: 'Boxes',
	box: {
		levelRequirement: 0,
		openAt: BoxOpenLocations.Archeologist,
		items: [
			{
				item: 'Pebble',
				minAmount: 1,
				maxAmount: 5,
				chance: 30,
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
			},
		],
	},
};
