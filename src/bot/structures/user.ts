import { Bot } from 'discordeno/*';
import { BotWithHelpersPlugin } from 'discordeno/helpers-plugin';
import { BotWithCustomProps } from '../bot';
import { userModel } from '../../db/schemas';
import { IUser } from '../../db/types/user';
import { Document, Types } from 'mongoose';
import { UserCoinManager, UserHealthManager, UserLevelManager } from '../managers/User';
import { UserGemManager } from '../managers/User/GemManager';
import { UserWorkManager } from '../managers/User/WorkManager';
import { UserCooldownManager } from '../managers/User/CooldownManager';

export class UserModule {
		readonly userId: bigint;
		readonly bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>;
		model!:
			| (Document<unknown, any, IUser> &
					IUser & {
						_id: Types.ObjectId;
					});
	
		constructor(bot: BotWithHelpersPlugin<BotWithCustomProps<Bot>>, userId: bigint) {
			this.bot = bot;
			this.userId = userId;
		}

	get coins(): UserCoinManager {
		return new UserCoinManager(this.bot, this.userId, this.model, this);
	}

	get gems(): UserGemManager {
		return new UserGemManager(this.bot, this.userId, this.model, this);
	}

	get level(): UserLevelManager {
		return new UserLevelManager(this.bot, this.userId, this.model, this);
	}

	get health(): UserHealthManager {
		return new UserHealthManager(this.bot, this.userId, this.model, this);
	}

	get work(): UserWorkManager {
		return new UserWorkManager(this.bot, this.userId, this.model, this);
	}

	get cooldowns(): UserCooldownManager {
		return new UserCooldownManager(this.bot, this.userId, this.model, this);
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
