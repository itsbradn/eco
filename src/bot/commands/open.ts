import { sendInteractionResponse } from 'discordeno';
import {
	ApplicationCommandOptionTypes,
	InteractionResponseTypes,
} from 'discordeno/types';
import { bot } from '../bot.js';
import { randomInt } from "crypto"
import { items, itemType } from '../data/items/index.js';
import { BoxItemData, Item } from '../structures/item.js';
import { UserModule } from '../structures/user.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'OPEN_NAME',
	description: 'OPEN_DESCRIPTION',
	options: [
		{
			name: 'OPEN_KEY_NAME',
			description: 'OPEN_KEY_DESCRIPTION',
			type: ApplicationCommandOptionTypes.String,
		},
	],
	execute: async function (_, interaction, args) {
		const itemKeys = Object.keys(items);
		const itemValues = Object.values(items);
		const itemArray: { key: itemType; value: Item }[] = [];
		for (let i = 0; i < itemKeys.length; i++) {
			const itemValue = itemValues[i];
			const itemKey = itemKeys[i];
			if (!itemValue || !itemKey) continue;
			if (itemValue.box === undefined) continue;
			itemArray.push({ key: itemKey as itemType, value: itemValue });
		}

		const itemChosen = itemArray.find((v) => args.box?.toLowerCase() === v.value.name.toLowerCase());

		if (!itemChosen || !itemChosen.value.box) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `⁉️ Uhh that doesn't exist...`,
							description: `We couldn't find a box by that name...`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

		const user = new UserModule(bot, interaction.user.id);
		await user.fetch();

		if (user.inventory.get(itemChosen.key) < 1) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `🚫 Sorry no free presents here.`,
							description: `You don't have any of that present in your inventory!`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

		const chosenItem = weightedRandomItem(itemChosen.value.box.items);
		const chosenAmount = randomInt(chosenItem.minAmount, chosenItem.maxAmount + 1);
		const chosenItemValue = items[chosenItem.item];

		user.inventory.add(chosenItem.item, chosenAmount);
		await user.save();

		return sendInteractionResponse(bot, interaction.id, interaction.token, {
			type: InteractionResponseTypes.ChannelMessageWithSource,
			data: {
				embeds: [
					{
						title: `🎊 Enjoy your present!`,
						description: `You got ${chosenAmount}x ${chosenItemValue.name}!`,
						color: bot.colors.success,
					}
				]
			}
		});
	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}

export function weightedRandomItem(array: BoxItemData[]) {
	var i;

	const weights: number[] = [];

	for (i = 0; i < array.length; i++) {
		weights[i] = array[i]?.chance ?? 0 + (weights[i - 1] || 0) 
	}

	var random = Math.random() * (weights[weights.length - 1] || 0);

	for (i = 0; i < weights.length; i++) {
		if (weights[i] || 0 > random) break;
	}

	const result = array[i];

	if (!result) throw new Error('Returned undefined item in weightedRandomItem');

	return result;
}