import { randomBytes } from "crypto"
import { bot } from "../bot";

export const percentChance = (chance: number) => {
	const num = (randomBytes(4).readUInt32LE() / 0x100000000) * 100;
	bot.logger.info(`[RANDOM] A random number was generated. Result: ${num}`);
	if (num < chance) return true;
	return false;
}