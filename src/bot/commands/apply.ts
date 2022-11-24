import { ApplicationCommandOptionTypes, InteractionResponseTypes } from 'discordeno/types';
import { bot } from '../bot.js';
import { jobArray } from '../data/jobs/index.js';
import { UserModule } from '../structures/user.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'APPLY_NAME',
	description: 'APPLY_DESCRIPTION',
	options: [
		{
			name: 'APPLY_JOB_NAME',
			description: 'APPLY_JOB_DESCRIPTION',
			required: true,
			type: ApplicationCommandOptionTypes.String,
		},
	] as const,
	execute: async function (_, interaction, args) {
		const jobChosen = jobArray.find((v) => {
			return (
				v.value.name.replace(/\s+/g, '').toLowerCase() === args.job.replace(/\s+/g, '').toLowerCase() ||
				v.key.toLowerCase() === args.job.toLowerCase()
			);
		});

		if (!jobChosen) {
			return interaction.reply({
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: "🧭 That's not a valid job.",
							description: "The job you tried to apply for doesn't exist. Did you type it correctly?",
							color: bot.colors.error,
						},
					],
				},
			});
		}
		const user = new UserModule(bot, interaction.user.id);
		await user.fetch();

		if (jobChosen.value.workRequirement > user.work.count) {
			return interaction.reply({
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: "💼 You aren't experienced enough!",
							description: `The job you tried to apply for requires you to work ${jobChosen.value.workRequirement} but you've only worked ${user.work.count} times.`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

		if (jobChosen.key === user.work.job) {
			return interaction.reply({
				type: InteractionResponseTypes.ChannelMessageWithSource,
				data: {
					embeds: [
						{
							title: "💼 About that...",
							description: `You already have this job!`,
							color: bot.colors.error,
						},
					],
				},
			});
		}

		user.work.setJob(jobChosen.key);
		user.save();
		return interaction.reply({
			type: InteractionResponseTypes.ChannelMessageWithSource,
			data: {
				embeds: [
					{
						title: "💼 Congratulations!",
						description: `You've been accepted for the job ${jobChosen.value.name}! Congratulations!`,
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
