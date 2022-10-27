import { Bot } from 'discordeno/*';
import { BotWithHelpersPlugin } from 'discordeno/helpers-plugin';
import { BotWithCustomProps } from '../bot';
import { userModel } from '../../db/schemas';
import { IUser } from '../../db/types/user';
import { Document, Types } from 'mongoose';
import { UserCoinManager, UserHealthManager, UserLevelManager } from '../managers/User';
import { UserGemManager } from '../managers/User/GemManager';

/**
 * Base UserModule for managing user data
 */
class UserModule {
	readonly userId: string;
	readonly bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>;
	model:
		| (Document<unknown, any, IUser> &
				IUser & {
					_id: Types.ObjectId;
				})
		| undefined;

	constructor(bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>, userId: string) {
		this.bot = bot;
		this.userId = userId;
	}

	/**
	 * Indicated whether this user module is a {@link HydratedUserModule}
	 * @returns {boolean}
	 */
	isHydrated(): this is HydratedUserModule {
		if (this.model === undefined) false;
		return true;
	}

	/**
	 * Indicated whether this user module is a {@link FreshUserModule}
	 * @returns {boolean}
	 */
	isFresh(): this is FreshUserModule {
		if (this.model === undefined) true;
		return false;
	}
}

/**
 * UserModule without any model.
 * @abstract
 */
abstract class FreshUserModule extends UserModule {
	/**
	 * Fetch this users data from database
	 * @returns {void}
	 */
	async fetch(): Promise<void> {
		let model = await userModel.findOne({ 'user.id': this.userId });
		if (!model) model = await userModel.create({ 'user.id': this.userId });
		this.model = model;

		return;
	}
}

/**
 * UserModule with model fetched and ready for managing.
 * @abstract
 */
abstract class HydratedUserModule extends UserModule {
	override readonly model!: Document<unknown, any, IUser> &
		IUser & {
			_id: Types.ObjectId;
		};

	get coins(): UserCoinManager {
		return new UserCoinManager(this.bot, this.userId, this.model);
	}

	get gems(): UserGemManager {
		return new UserGemManager(this.bot, this.userId, this.model);
	}

	get level(): UserLevelManager {
		return new UserLevelManager(this.bot, this.userId, this.model);
	}

	get health(): UserHealthManager {
		return new UserHealthManager(this.bot, this.userId, this.model);
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
