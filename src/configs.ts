import { getBotIdFromToken, Intents } from 'discordeno';
import dotenv from 'dotenv';
dotenv.config();

/** The bot id, derived from the bot token. */
export const BOT_ID = getBotIdFromToken(process.env.DISCORD_TOKEN as string);
export const EVENT_HANDLER_URL = `http://${process.env.EVENT_HANDLER_HOST}:${process.env.EVENT_HANDLER_PORT}`;
export const REST_URL = `http://${process.env.REST_HOST}:${process.env.REST_PORT}`;
export const GATEWAY_URL = `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`;

export const DEVELOPMENT = process.env.DEVELOPMENT ?? true;

export const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${
	process.env.MONGO_URL
}/${DEVELOPMENT ? process.env.DEV_MONGO_DB : process.env.PROD_MONGO_DB}`;

export const USER_SCHEMA_VER = process.env.USER_SCHEMA_VER ?? 1
// Gateway Proxy Configurations
/** The gateway intents you would like to use. */
export const INTENTS: Intents =
	// SETUP-DD-TEMP: Add the intents you want enabled here. Or Delete the intents you don't want in your bot.
	Intents.DirectMessageReactions |
	Intents.DirectMessageTyping |
	Intents.DirectMessages |
	Intents.GuildBans |
	Intents.GuildEmojis |
	Intents.GuildIntegrations |
	Intents.GuildInvites |
	Intents.GuildMembers |
	Intents.GuildMessageReactions |
	Intents.GuildMessageTyping |
	Intents.GuildMessages |
	Intents.GuildPresences |
	Intents.GuildVoiceStates |
	Intents.GuildWebhooks |
	Intents.Guilds;
