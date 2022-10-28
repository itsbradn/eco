import { Bot } from "discordeno/*";
import { BotWithHelpersPlugin } from "discordeno/helpers-plugin";
import { Document, Types } from "mongoose";
import { IUser } from "../../../db/types/user";
import { BotWithCustomProps } from "../../bot";
import { HydratedUserModule } from "../../structures";


/**
 * Manages the modification of user model and saving to database
 * @abstract
 */
 export abstract class UserDataManager {
	readonly userId: string;
	readonly bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>;
	readonly model: Document<unknown, any, IUser> &
		IUser & {
			_id: Types.ObjectId;
		};
	userModule: HydratedUserModule

	constructor(
		bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>,
		userId: string,
		model: Document<unknown, any, IUser> &
			IUser & {
				_id: Types.ObjectId;
			},
			userModule: HydratedUserModule
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