import { Bot } from "discordeno/*";
import { BotWithHelpersPlugin } from "discordeno/helpers-plugin";
import { Document, Types } from "mongoose";
import { IUser } from "../../../db/types/user";
import { BotWithCustomProps } from "../../bot";
import { UserModule } from "../../structures";


/**
 * Manages the modification of user model and saving to database
 * @abstract
 */
 export abstract class UserDataManager {
	readonly userId: bigint;
	readonly bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>;
	readonly model: Document<unknown, any, IUser> &
		IUser & {
			_id: Types.ObjectId;
		};
	userModule: UserModule

	constructor(
		bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>,
		userId: bigint,
		model: Document<unknown, any, IUser> &
			IUser & {
				_id: Types.ObjectId;
			},
			userModule: UserModule
	) {
		this.bot = bot;
		this.userId = userId;
		this.model = model;
		this.userModule = userModule;
	}

	/**
	 * Saves user data to database
	 */
	async save(): Promise<
		Document<unknown, any, IUser> &
			IUser & {
				_id: Types.ObjectId;
			}
	> {
		return await this.model.save();
	}
}