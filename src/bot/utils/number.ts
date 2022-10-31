import { randomBytes } from "crypto"
import { bot } from "../bot";

export const percentChance = (chance: number) => {
	const num = (randomBytes(4).readUInt32LE() / 0x100000000) * 100;
	bot.logger.info(`[RANDOM] A percent chance was generated. Wanted: < ${chance} Result: ${num} ${num < chance}`);
	return (num < chance)
}