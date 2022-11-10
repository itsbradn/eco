import { sendInteractionResponse } from 'discordeno';
import { ApplicationCommandOptionTypes, InteractionResponseTypes } from 'discordeno/types';
import { bot } from '../bot.js';
import { items, itemType } from '../data/items/index.js';
import { Item } from '../structures/item.js';
import { UserModule } from '../structures/user.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'CRAFT_NAME',
	description: 'CRAFT_DESCRIPTION',
	options: [
		{
			name: 'CRAFT_KEY_NAME',
			description: 'CRAFT_KEY_DESCRIPTION',
			type: ApplicationCommandOptionTypes.String,
		},
	],
	execute: async function (_, interaction,args) {
		const itemKeys = Object.keys(items);
		const itemValues = Object.values(items);
		const itemArray: { key: itemType; value: Item }[] = [];
		for (let i = 0; i < itemKeys.length; i++) {
			const itemValue = itemValues[i];
			const itemKey = itemKeys[i];
			if (!itemValue || !itemKey) continue;
			if (itemValue.crafting === undefined) continue;
			itemArray.push({ key: itemKey as itemType, value: itemValue });
		}
        
		const itemChosen = itemArray.find((v) => args.item?.toLowerCase() === v.value.name.toLowerCase());
        
		if (!itemChosen || !itemChosen.value.crafting) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `⁉️ Uhh that doesn't exist...`,
							description: `Check the item list again because I couldn't find that...`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

        const user = new UserModule(bot, interaction.user.id);
        await user.fetch();

		if (itemChosen.value.crafting.levelRequirement > user.level.level) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `🚫 You need more experience to craft this items...`,
							description: `You need to be level ${itemChosen.value.crafting.levelRequirement} to craft this item!`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

        let hasRequirements = true;

        for (const item of itemChosen.value.crafting.itemRequirements) {
            if (user.inventory.get(item.item) < item.amount) {
                hasRequirements = false;
                break;
            }
            continue;
        }

        if (!hasRequirements) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `🚫 Get back to work.`,
							description: `You don't have enough of the required items to craft this item.`,
							color: bot.colors.error,
						},
					],
				},
			});
        }

        for (const item of itemChosen.value.crafting.itemRequirements) {
            user.inventory.del(item.item, item.amount);
            continue;
        }
        
        user.inventory.add(itemChosen.key, 1);

        
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `Good work! ✔️`,
							description: `You just crafted 1x ${itemChosen.value.name}!`,
							color: bot.colors.success,
						},
					],
				},
			});
	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}
