import { sendInteractionResponse, Interaction } from 'discordeno';
import { InteractionResponseTypes, MessageComponentTypes, TextStyles } from 'discordeno/types';
import { bot } from '../bot.js';
import { jobs } from '../data/jobs/index.js';
import { wordList } from '../data/lists/words.js';
import { translate } from '../languages/translate.js';
import { UserModule } from '../structures/user.js';
import { needModalResponse } from '../utils/collectors.js';
import { checkCooldown } from '../utils/cooldowns.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'WORK_NAME',
	description: 'WORK_DESCRIPTION',
	execute: async function (_, interaction) {
		if (!interaction.channelId) {
			return sendInteractionResponse(bot, interaction.id, interaction.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: `Are you lost?`,
							description: translate(interaction.guildId || 'english', 'WORK_NO_CHANNEL'),
							color: bot.colors.error,
						},
					],
				},
			});
		}


		const user: UserModule = new UserModule(bot, interaction.user.id);
		await user.fetch();

		const cd = checkCooldown(interaction, 'work', user)
		if (cd) return;

		let word = wordList[Math.floor(Math.random() * wordList.length)];

		while (!word) word = wordList[Math.floor(Math.random() * wordList.length)];

		let scrambledWord = word
			.split('')
			.sort(() => {
				return 0.5 - Math.random();
			})
			.join('');

		sendInteractionResponse(bot, interaction.id, interaction.token, {
			type: InteractionResponseTypes.Modal,
			data: {
				customId: 'work_modal',
				title: '💼 Unscramble the word ' + scrambledWord,
				components: [
					{
						type: MessageComponentTypes.ActionRow,
						components: [
							{
								type: MessageComponentTypes.InputText,
								style: TextStyles.Short,
								customId: 'main-word',
								label: `Unscrambled Word`,
								required: true,
							},
						],
					},
				],
			},
		});
		const modalResponse: Interaction | undefined = await needModalResponse(interaction.user.id);

		let typed = '';
		if (!modalResponse) return;

		if (modalResponse && modalResponse.data?.components && modalResponse.data.components[0]?.components) {
			let wordResponse = modalResponse.data.components[0].components.find((v) => {
				return v.customId === 'main-word';
			});
			if (wordResponse) {
				typed = wordResponse.value;
			}
		}
		const result = user.work.addWork(word.toLowerCase(), typed.toLowerCase());

		const job = jobs[user.work.job];

		if (result.status === 'failed') {
			user.cooldowns.set('work', 20);
			await user.save();
			return sendInteractionResponse(bot, modalResponse.id, modalResponse.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: 'Wrong Answer ❌',
							description: `That was the wrong answer! The word was \`${word}\``,
							color: bot.colors.error,
						},
					],
				},
			});
		}
		if (result.status === 'success') {
			const pay = user.work.pay;
			user.coins.add(pay, 'Successful Work', 'Work Command');
			user.cooldowns.set('work', 20);
			await user.save();
			return sendInteractionResponse(bot, modalResponse.id, modalResponse.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: 'Good job! 🎊',
							description: job.messages['good'][Math.floor(Math.random() * job.messages['good'].length)],
							color: bot.colors.success,
						},
					],
				},
			});
		}
		if (result.status === 'perfect') {
			const pay = user.work.perfectPay;
			user.coins.add(pay, 'Perfect Work', 'Work Command');
			user.cooldowns.set('work', 20);
			await user.save();
			return sendInteractionResponse(bot, modalResponse.id, modalResponse.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: 'Amazing Job! 🎊',
							description: job.messages['perfect'][Math.floor(Math.random() * job.messages['perfect'].length)],
							color: bot.colors.success,
						},
					],
				},
			});
		}
		if (result.status === 'sick') {
			user.cooldowns.set('work', 300);
			await user.save();
			return sendInteractionResponse(bot, modalResponse.id, modalResponse.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: 'You got sick 🤢',
							description: 'You caught a cold and are unable to work for 5 minutes!',
							color: bot.colors.error,
						},
					],
				},
			});
		}
		if (result.status === 'fired') {
			user.cooldowns.set('work', 20);
			await user.save();
			return sendInteractionResponse(bot, modalResponse.id, modalResponse.token, {
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: 'You\'re fired! 🔥',
							description: job.messages['bad'][Math.floor(Math.random() * job.messages['bad'].length)],
							color: bot.colors.error,
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
