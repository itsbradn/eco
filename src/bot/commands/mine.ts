import { randomInt } from 'crypto';
import { sendInteractionResponse } from 'discordeno';
import {
	InteractionResponseTypes,
	MessageComponentTypes,
	ButtonStyles,
	MessageComponents,
	InteractionTypes,
} from 'discordeno/types';
import { bot } from '../bot.js';
import { itemArray, itemType } from '../data/items/index.js';
import { translate } from '../languages/translate.js';
import { Item } from '../structures/item.js';
import { UserModule } from '../structures/user.js';
import { collectInteractions } from '../utils/collectors.js';
import { checkCooldown } from '../utils/cooldowns.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'MINE_NAME',
	description: 'MINE_DESCRIPTION',
	execute: async function (_, interaction) {
		if (!interaction.channelId) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `🧭 Are you lost?`,
							description: translate(interaction.guildId || 'english', 'WORK_NO_CHANNEL'),
							color: bot.colors.error,
						},
					],
				},
			});
		}

		const user: UserModule = new UserModule(bot, interaction.user.id);
		await user.fetch();

		const cd = checkCooldown(interaction, 'mine', user);
		if (cd) return;

		const pickaxe = user.mine.pickaxe;
		const chisel = user.mine.chisel;
		const chiselDamage = chisel?.tool?.type === 'chisel' ? chisel.tool.damage : 0;

		if (!pickaxe || pickaxe.tool === undefined || pickaxe.tool.type !== 'pickaxe') {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `🧭 Are you lost?`,
							description: `You must own a pickaxe to go mining!`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

		const pickaxePower = pickaxe.tool.power;
		const pickaxeMinDamage = pickaxe.tool.minDamage;
		const pickaxeMaxDamage = pickaxe.tool.maxDamage;

		const materials = itemArray.filter((v) => {
			if (!v.value.obtainable?.mining?.powerNeeded) return false;
			return (v.value.obtainable.mining.powerNeeded || 1) <= pickaxePower;
		});

		const materialChosen = weightedRandomItem(materials);

		if (!materialChosen.value.obtainable?.mining) throw new Error('Selected random item w/o mining data');

		const health = randomInt(
			materialChosen.value.obtainable.mining.minHealth,
			materialChosen.value.obtainable.mining.maxHealth,
		);
		let curHealth = health;
		const amount = randomInt(
			materialChosen.value.obtainable.mining.minAmount,
			materialChosen.value.obtainable.mining.maxAmount,
		);

		const components: MessageComponents = [
			{
				type: MessageComponentTypes.ActionRow,
				components: [
					{
						type: MessageComponentTypes.Button,
						style: ButtonStyles.Primary,
						customId: 'pickaxe',
						label: '⛏️ Pickaxe',
					},
				],
			},
		];

		if (chisel)
			components[0]?.components.push({
				type: MessageComponentTypes.Button,
				style: ButtonStyles.Secondary,
				customId: 'chisel',
				label: '🪛 Chisel',
			});

		await interaction.reply({
			type: InteractionResponseTypes.ChannelMessageWithSource,
			data: {
				embeds: [
					{
						title: `⛏️ ${interaction.user.username}'s Mining Trip`,
						description: `Use a pickaxe or chisel to damage the ore.\nIf you damage the ore too much it will break.`,
						fields: [
							{
								name: 'Ore Info ✨',
								value: `Health: **${curHealth}/${health}**`,
							},
						],
						color: bot.colors.default,
					},
				],
				components,
			},
		});

		const handlePrompt = async (): Promise<void> => {
			if (curHealth > 0) {
				interaction.editReply({
					embeds: [
						{
							title: `⛏️ ${interaction.user.username}'s Mining Trip`,
							description: `Use a pickaxe or chisel to damage the ore.\nIf you damage the ore too much it will break.`,
							fields: [
								{
									name: 'Ore Info ✨',
									value: `Health: **${curHealth}/${health}**`,
								},
							],
							color: bot.colors.default,
						},
					],
					components,
				});

				const res = await collectInteractions({
					amount: 1,
					key: interaction.user.id,
					createdAt: Date.now(),
					duration: 60000,
					filter: (i) => {
						if (i.type !== InteractionTypes.MessageComponent) return false;
						if (!i.data) return false;
						if (i.data.customId === 'pickaxe' || i.data.customId === 'chisel') {
							sendInteractionResponse(bot, i.id, i.token, {
								type: InteractionResponseTypes.DeferredUpdateMessage,
							})
							return true;
						};
						return false;
					},
				});

				const response = res[0];
				if (!response) {
					interaction.editReply({
						embeds: [
							{
								title: `❌ ${interaction.user.username}'s Mining Trip`,
								description: `You failed to respond in time and got lost in the mines.`,
								color: bot.colors.error,
							},
						],
						components: [],
					});
					return;
				}
				if (!response.data) throw new Error('Response without data from mining trip.');
				if (response.data.customId === 'pickaxe') {
					curHealth -= randomInt(pickaxeMinDamage, pickaxeMaxDamage + 1);
					return handlePrompt();
				}
				if (response.data.customId === 'chisel') {
					curHealth -= chiselDamage;
					if (curHealth < 0) curHealth = 0;
					return handlePrompt();
				}
			}
			if (curHealth === 0) {
				const mineData = user.mine.addMine(materialChosen.key, health, false, amount);
				user.inventory.add(materialChosen.key, amount);
				let rewards = {
					name: '🎁 Rewards',
					value: `${materialChosen.value.emoji} +${amount} ${materialChosen.value.name}\n`,
				}
				let penalties = {
					name: '❌ Penalties',
					value: ``,
				}

				if (mineData.gotFossil) {
				} // ADD FOSSIL
				if (mineData.gotArtifact) {
				} // ADD ARTIFACT
				if (mineData.brokePickaxe) penalties.value += `${pickaxe.emoji} ${pickaxe.name} broke!\n`;
				if (mineData.didLevelUp) rewards.value += `🌟 +1 level!\n`;
				rewards.value += `⭐ +${mineData.expGained} experience!\n`

				const fields: {
					inline?: boolean | undefined;
					name: string;
					value: string;
				}[] = [rewards];
				if (penalties.value !== ``) fields.push(penalties);

				await user.save();
				interaction.editReply({
					embeds: [
						{
							title: `⛏️ ${interaction.user.username}'s Mining Trip`,
							description: `Good job! You successfully mined ${amount} ${materialChosen.value.name}!`,
							fields,
							color: bot.colors.success,
						}
					],
					components: [],
				})
				return;
			}

			if (curHealth < 0) {
				let rewards = {
					name: '🎁 Rewards',
					value: ``,
				}
				let penalties = {
					name: '❌ Penalties',
					value: ``,
				}
				const mineData = user.mine.addMine(materialChosen.key, health - curHealth, true, amount);
				if (mineData.didLevelUp) rewards.value += `🌟 +1 level!\n`;
				rewards.value += `⭐ +${mineData.expGained} experience!\n`
				if (mineData.brokePickaxe) penalties.value += `${pickaxe.emoji} ${pickaxe.name} broke!\n`;

				await user.save();
				const fields: {
					inline?: boolean | undefined;
					name: string;
					value: string;
				}[] = [rewards];
				if (penalties.value !== ``) fields.push(penalties);
				interaction.editReply({
					embeds: [
						{
							title: `⛏️ ${interaction.user.username}'s Mining Trip`,
							description: `You damaged the ore too much and broke ${amount} ${materialChosen.value.name}.`,
							fields,
							color: bot.colors.error,
						}
					],
					components: [],
				})
				return;
			}
		};

		handlePrompt();
	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}

function weightedRandomItem(array: { key: itemType; value: Item }[]) {
	var i;

	const weights: number[] = [];

	for (i = 0; i < array.length; i++) {
		weights[i] = (array[i]?.value.obtainable?.mining?.chance ?? 0) + (weights[i - 1] ?? 0);
	}

	var random = Math.random() * (weights[weights.length - 1] || 0);

	for (i = 0; i < weights.length; i++) {
		if ((weights[i] || 0) > random) break;
	}

	const result = array[i];

	if (!result) throw new Error('Returned undefined item in weightedRandomItem');

	return result;
}
