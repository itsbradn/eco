import { sendInteractionResponse } from 'discordeno';
import {
	ApplicationCommandOptionTypes,
	ButtonComponent,
	ButtonStyles,
	InteractionResponseTypes,
	MessageComponentTypes,
} from 'discordeno/types';
import { bot } from '../bot.js';
import { jobArray, jobs } from '../data/jobs/index.js';
import { UserModule } from '../structures/user.js';
import { collectInteractions } from '../utils/collectors.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'JOBS_NAME',
	description: 'JOBS_DESCRIPTION',
	options: [
		{
			name: 'JOBS_PAGE',
			description: 'JOBS_PAGE_DESCRIPTION',
			required: false,
			type: ApplicationCommandOptionTypes.Integer,
		},
	] as const,
	execute: async function (_, interaction, args) {
		const username = interaction.user.username;
		const user = new UserModule(bot, interaction.user.id);
		await user.fetch();

		const jobsPerPage = 5;
		const pages = Math.ceil(jobArray.length / jobsPerPage);

		const page = Math.round(args.page ? args.page : 1) > pages ? pages : Math.round(args.page ? args.page : 1);

		const sendEmbed = async (page: number, send?: boolean): Promise<void> => {
			const startingIndex = page * jobsPerPage - jobsPerPage;
			let jobString = ``;

			for (let i = 0; i < jobsPerPage; i++) {
				const jobData = jobArray[i + startingIndex];
				if (!jobData) continue;
				const job = jobs[jobData.key];

				jobString += `${job.name}: **${job.workRequirement}** ${user.work.count >= job.workRequirement ? '✅' : ''} ${
					user.work.job === jobData.key ? '**🌟**' : ''
				}\n`;
			}

			let components: ButtonComponent[] = [];

			if (page < 2) {
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
								title: `${username}'s Jobs (Page ${page}/${pages})`,
								description: jobString === '' ? 'There is currently no jobs!' : jobString,
								color: bot.colors.default,
								footer: {
									text: '✅ = Available | 🌟 = Current',
								},
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
							title: `${username}'s Jobs ${page > 0 ? `(Page ${page}/${pages})` : ''}`,
							description: jobString === '' ? 'There is currently no jobs!' : jobString,
							color: bot.colors.default,
							footer: {
								text: '✅ = Available | 🌟 = Current',
							},
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
							title: `${username}'s Jobs ${page > 0 ? `(Page ${page}/${pages})` : ''}`,
							description: jobString === '' ? 'There is currently no jobs!' : jobString,
							color: bot.colors.default,
							footer: {
								text: '✅ = Available | 🌟 = Current',
							},
						},
					],
					components: [],
				});
				return;
			}
			sendInteractionResponse(bot, response.id, response.token, {
				type: InteractionResponseTypes.DeferredUpdateMessage,
			});

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
