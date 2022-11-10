import { InteractionResponseTypes } from 'discordeno/types';
import { bot } from '../bot.js';
import { UserModule } from '../structures/user.js';
import { createCommand } from '../utils/slash/createCommand.js';

export default createCommand({
	name: 'PROFILE_NAME',
	description: 'PROFILE_DESCRIPTION',
	execute: async function (_, interaction) {

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
