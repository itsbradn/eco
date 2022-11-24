import { ApplicationCommandOptionTypes, InteractionResponseTypes } from 'discordeno/types';
import { bot } from '../bot.js';
import { UserModule } from '../structures/user.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'PROFILE_NAME',
    description: 'PROFILE_DESCRIPTION',
    options: [
        {
            name: 'PROFILE_USER',
            description: 'PROFILE_USER_DESCRIPTION',
            required: false,
            type: ApplicationCommandOptionTypes.User,
        }
    ],
	execute: async function (_, interaction, args) {

        if (args.user) {
            const user = new UserModule(bot, args.user.user.id);
            await user.fetch();

            interaction.reply({
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: `${args.user.user.username}'s Profile 👜`,
                            fields: [
                                {
                                    name: 'Economy',
                                    value: `🪙 Coins: **${user.coins.balance}**\n💎 Gems: **${user.gems.balance}**`,
                                }
                            ],
                            color: bot.colors.default,
                        }
                    ]
                }
            })
            return;
        }

        const user = new UserModule(bot, interaction.user.id);
        await user.fetch();

        interaction.reply({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: `${interaction.user.username}'s Profile 👜`,
                        fields: [
                            {
                                name: 'Economy',
                                value: `🪙 Coins: **${user.coins.balance}**\n💎 Gems: **${user.gems.balance}**`,
                            }
                        ],
                        color: bot.colors.default,
                    }
                ]
            }
        })

	},
});

// TODO: This should be deleted once this is available in the helpers plugin.
export function snowflakeToTimestamp(id: bigint) {
	return Number(id / 4194304n + 1420070400000n);
}
