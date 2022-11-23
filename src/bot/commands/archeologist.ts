import { ApplicationCommandOptionTypes, InteractionResponseTypes } from 'discordeno/types';
import { BoxItemData, BoxOpenLocations, Item } from '../structures/item.js';
import { items, itemType } from '../data/items/index.js';
import { createCommand } from '../utils/slash/createCommand.js';
import { sendInteractionResponse } from 'discordeno';
import { bot } from '../bot.js';
import { UserModule } from '../structures/user.js';
import { randomInt } from 'crypto';

export default createCommand({
	name: 'ARCHEOLOGIST_NAME',
	description: 'ARCHEOLOGIST_DESCRIPTION',
	options: [
		{
			type: ApplicationCommandOptionTypes.SubCommand,
			name: 'ARCHEOLOGIST_SUB_OPEN_NAME',
			description: 'ARCHEOLOGIST_SUB_OPEN_DESCRIPTION',
			options: [
				{
					name: 'OPEN_KEY_NAME',
					description: 'OPEN_KEY_DESCRIPTION',
					type: ApplicationCommandOptionTypes.String,
				},
			],
		},
	],
	execute: async function (_, interaction, args) {
		console.log('wrong');
		if (args.open) {
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

			const itemChosen = itemArray.find((v) => args.open?.box?.toLowerCase() === v.value.name.toLowerCase());
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

			if (itemChosen.value.box.openAt !== BoxOpenLocations.Archeologist) {
				if (itemChosen.value.box.openAt === BoxOpenLocations.Blacksmith) {
					return sendInteractionResponse(bot, interaction.id, interaction.token, {
						type: InteractionResponseTypes.ChannelMessageWithSource,
						data: {
							embeds: [
								{
									title: `🚫 You can't open this kind of present here!`,
									description: `You can only open this present at the blacksmith. Do /Blacksmith`,
									color: bot.colors.error,
								},
							],
						},
					});
				}
				if (itemChosen.value.box.openAt === BoxOpenLocations.Personal) {
					return sendInteractionResponse(bot, interaction.id, interaction.token, {
						type: InteractionResponseTypes.ChannelMessageWithSource,
						data: {
							embeds: [
								{
									title: `🚫 You can't open this kind of present here!`,
									description: `You can only open this present on your own. Do /open`,
									color: bot.colors.error,
								},
							],
						},
					});
				}
				if (itemChosen.value.box.openAt === BoxOpenLocations.Fisherman) {
					return sendInteractionResponse(bot, interaction.id, interaction.token, {
						type: InteractionResponseTypes.ChannelMessageWithSource,
						data: {
							embeds: [
								{
									title: `🚫 You can't open this kind of present here!`,
									description: `You can only open this present at the blacksmith. Do /Fisherman`,
									color: bot.colors.error,
								},
							],
						},
					});
				}
				return sendInteractionResponse(bot, interaction.id, interaction.token, {
					type: InteractionResponseTypes.ChannelMessageWithSource,
					data: {
						embeds: [
							{
								title: `🚫 You can't open this kind of present here!`,
								description: `This command only lets you open personal presents.`,
								color: bot.colors.error,
							},
						],
					},
				});
			}

			if (itemChosen.value.box.levelRequirement > user.level.level) {
				return sendInteractionResponse(bot, interaction.id, interaction.token, {
					type: InteractionResponseTypes.ChannelMessageWithSource,
					data: {
						embeds: [
							{
								title: `🚫 You need more experience to open this gift...`,
								description: `You need to be level ${itemChosen.value.box.levelRequirement} to open this box!`,
								color: bot.colors.error,
							},
						],
					},
				});
			}

			if (user.coins.balance < 1500) {
				return sendInteractionResponse(bot, interaction.id, interaction.token, {
					type: InteractionResponseTypes.ChannelMessageWithSource,
					data: {
						embeds: [
							{
								title: `🚫 You don't have enough money!`,
								description: `You need to pay 1,500 coins to the Archeologist to open this box.`,
								color: bot.colors.error,
							},
						],
					},
				});
			}

			const chosenItem = weightedRandomItem(itemChosen.value.box.items);
			const chosenAmount = randomInt(chosenItem.minAmount, chosenItem.maxAmount + 1);
			const chosenItemValue = items[chosenItem.item];

			user.inventory.del(itemChosen.key, 1);
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
						},
					],
				},
			});
		}
	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}

function weightedRandomItem(array: BoxItemData[]) {
	var i;

	const weights: number[] = [];

	for (i = 0; i < array.length; i++) {
		weights[i] = (array[i]?.chance ?? 0) + (weights[i - 1] ?? 0);
	}

	var random = Math.random() * (weights[weights.length - 1] || 0);

	for (i = 0; i < weights.length; i++) {
		if ((weights[i] || 0) > random) break;
	}

	const result = array[i];

	if (!result) throw new Error('Returned undefined item in weightedRandomItem');

	return result;
}
