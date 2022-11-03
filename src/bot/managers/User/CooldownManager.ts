import { UserDataManager } from './BaseDataManager';

export class UserCooldownManager extends UserDataManager {
	get(name: string) {
		let cd = this.model.meta.cooldowns.find((v) => v.name.toLowerCase() === name.toLowerCase());

		if (!cd) {
			return {
				expired: true,
				timeUntilExpire: 0,
				expiresAt: new Date(Date.now() - 60000),
			};
		}

		return {
			expired: cd.endsAt < new Date(),
			timeUntilExpire: cd.endsAt.getTime() - Date.now(),
			expiresAt: cd.endsAt,
		};
	}

	set(name: string, duration: number) {
		const date = new Date();
		const durationInMs = duration * 1000;

		let cd = this.model.meta.cooldowns.find((v) => v.name.toLowerCase() === name.toLowerCase());

		if (!cd) {
			this.model.meta.cooldowns.push({
				name: name.toLowerCase(),
				endsAt: new Date(date.getTime() + durationInMs),
				lastSetAt: date,
				history: [],
			});

			return cd;
		}

		const index = this.model.meta.cooldowns.indexOf(cd);

		cd.history.push({
			name: name,
			setAt: cd.lastSetAt,
			expiredAt: cd.endsAt,
		});

		cd.endsAt = new Date(date.getTime() + durationInMs);
		cd.lastSetAt = date;

		this.model.meta.cooldowns[index] = cd;
		this.model.markModified('meta.cooldowns');

		return cd;
	}
}
