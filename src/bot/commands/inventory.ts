import {
	ApplicationCommandOptionTypes,
	ButtonComponent,
	ButtonStyles,
	InteractionResponseTypes,
	MessageComponentTypes,
} from 'discordeno/types';
import { bot } from '../bot.js';
import { items } from '../data/items/index.js';
import { UserModule } from '../structures/user.js';
import { collectInteractions } from '../utils/collectors.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'INVENTORY_NAME',
	description: 'INVENTORY_DESCRIPTION',
	options: [
		{
			name: 'INVENTORY_PAGE',
			description: 'INVENTORY_PAGE_DESCRIPTION',
			required: false,
			type: ApplicationCommandOptionTypes.Integer,
		},
		{
			name: 'INVENTORY_USER',
			description: 'INVENTORY_USER_DESCRIPTION',
			required: false,
			type: ApplicationCommandOptionTypes.User,
		},
	] as const,
	execute: async function (_, interaction, args) {
		const username = args.user ? args.user.user.username : interaction.user.username;
		const user = args.user ? new UserModule(bot, args.user.user.id) : new UserModule(bot, interaction.user.id);
		await user.fetch();

		const inventory = user.inventory.inventory.filter((v) => v.amount > 0);

		const itemsPerPage = 15;
		const pages = Math.ceil(inventory.length / itemsPerPage);

		const page = Math.round(args.page ? args.page : 1) > pages ? pages : Math.round(args.page ? args.page : 1);

		const sendEmbed = async (page: number, send?: boolean): Promise<void> => {
			const startingIndex = page * itemsPerPage - itemsPerPage;
			let inventoryString = ``;

			for (let i = 0; i < itemsPerPage; i++) {
				const itemData = inventory[i + startingIndex];
				if (!itemData) continue;
				const item = items[itemData.name];

				inventoryString += `${item.emoji} ${item.name}: **${itemData.amount}**\n`;
			}

			let components: ButtonComponent[] = [];

			if (page === 1) {
				components.push({
					type: MessageComponentTypes.Button,
					customId: 'last',
					label: 'Last Page',
					style: ButtonStyles.Primary,
					disabled: true,
				});
			} else {
				components.push({
					type: MessageComponentTypes.Button,
					customId: 'last',
					label: 'Last Page',
					style: ButtonStyles.Primary,
				});
			}

			if (page === pages) {
				components.push({
					type: MessageComponentTypes.Button,
					customId: 'next',
					label: 'Next Page',
					style: ButtonStyles.Primary,
					disabled: true,
				});
			} else {
				components.push({
					type: MessageComponentTypes.Button,
					customId: 'next',
					label: 'Next Page',
					style: ButtonStyles.Primary,
				});
			}

			if (send) {
				interaction.reply({
					type: InteractionResponseTypes.ChannelMessageWithSource,
					data: {
						embeds: [
							{
								title: `${username}'s Inventory (Page ${page}/${pages})`,
								description: inventoryString,
								color: bot.colors.default,
							},
						],
						components: [
							{
								type: MessageComponentTypes.ActionRow,
								components: components as [ButtonComponent, ButtonComponent],
							},
						],
					},
				});
			} else {
				interaction.editReply({
					embeds: [
						{
							title: `${username}'s Inventory (Page ${page}/${pages})`,
							description: inventoryString,
							color: bot.colors.default,
						},
					],
					components: [
						{
							type: MessageComponentTypes.ActionRow,
							components: components as [ButtonComponent, ButtonComponent],
						},
					],
				});
			}

			const collected = await collectInteractions({
				filter: (v) => v.data?.customId === 'next' || v.data?.customId === 'last',
				key: interaction.user.id,
				amount: 1,
				createdAt: Date.now(),
				duration: 60000,
			});

			const response = collected[0];

			if (!response || !response.data?.customId) {
				interaction.editReply({
					embeds: [
						{
							title: `${username}'s Inventory (Page ${page}/${pages})`,
							description: inventoryString,
							color: bot.colors.default,
						},
					],
				});
				return;
			}

			if (response.data.customId === 'next') {
				return sendEmbed(page + 1);
			}

			if (response.data.customId === 'last') {
				return sendEmbed(page - 1);
			}
		};

		sendEmbed(page, true);
	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}
