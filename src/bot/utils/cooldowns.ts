import { Interaction, InteractionResponseTypes, InteractionTypes, sendInteractionResponse } from "discordeno";
import { bot } from "../bot";
import { UserModule } from "../structures";
import { msToTime } from './time';

export const checkCooldown = (interaction: Interaction, name: string, user: UserModule) => {
	const cooldown =user.cooldowns.get(name);

	if (cooldown.expired === true) {
		return false;
	}

	if (interaction.type !== InteractionTypes.ApplicationCommand) return true;
	sendInteractionResponse(bot, interaction.id, interaction.token, {
		type: InteractionResponseTypes.ChannelMessageWithSource,
		data: {
			embeds: [
				{
					title: '🍵 Take some time to relax.',
					description: `You still have ${msToTime(cooldown.timeUntilExpire)} until you can use this command again!`,
					color: bot.colors.warn,
				}
			]
		}
	});

	return true;
}