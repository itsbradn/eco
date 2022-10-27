import { UserDataManager } from './BaseDataManager';

export class UserCoinManager extends UserDataManager {
	get balance(): number {
		return this.model.economy.coins;
	}

	add(amount: number, reason: string, from: string): number {
		amount = Math.round(amount);
		this.model.economy.coins += amount;

		this.model.economy.history.push({
			addOrDel: 'add',
			currency: 'coin',
			amount,
			reason,
			from,
		});
		this.model.markModified('economy.history');

		return this.model.economy.coins;
	}

	remove(amount: number, reason: string, from: string): number {
		amount = Math.round(amount);
		this.model.economy.coins -= amount;

		this.model.economy.history.push({
			addOrDel: 'del',
			currency: 'coin',
			amount,
			reason,
			from,
		});
		this.model.markModified('economy.history');

		return this.model.economy.coins;
	}

	set(amount: number, reason: string, from: string): number {
		amount = Math.round(amount);

		if (amount > this.balance) return this.add(amount - this.balance, reason, from);
		if (amount < this.balance) return this.remove(this.balance - amount, reason, from);
		return this.balance;
	}

	get history(): [
		{
			amount: number;
			currency: 'coin';
			addOrDel: 'add' | 'del';
			reason: string;
			from: string;
		},
	] {
		return this.model.economy.history.filter((v) => {
			return v.currency === 'coin';
		}) as [
			{
				amount: number;
				currency: 'coin';
				addOrDel: 'add' | 'del';
				reason: string;
				from: string;
			},
		];
	}
}
