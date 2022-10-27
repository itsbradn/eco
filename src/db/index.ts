import { createLogger } from "discordeno/logger";
import { connect } from "mongoose";
import { MONGO_URI } from "../configs";

export const logger = createLogger({name: "[Database]"})

export const connectToDb = async () => {
	let initAt = Date.now();
	await connect(MONGO_URI);
	logger.info(`Connected to database in ${Date.now() - initAt}ms`);
}