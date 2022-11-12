import { Item } from "../../../structures/item";

export const FlimsyChisel: Item = {
	name: 'Flimsy Chisel',
	emoji: '🪛',
	description: 'A flimsy chisel that can slightly damage ores.',
	category: 'Mining',
	tool: {
		type: 'chisel',
		damage: 1,
	},
	crafting: {
		levelRequirement: 0,
		itemRequirements: [
			{
				item: 'Stick',
				amount: 2,
			},
			{
				item: 'Pebble',
				amount: 12,
			},
		]
	}
}