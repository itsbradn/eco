import { UserDataManager } from './BaseDataManager';

export class UserGemManager extends UserDataManager {
	get balance(): number {
		return this.model.economy.gems;
	}

	add(amount: number, reason: string, from: string): number {
		amount = Math.round(amount);
		this.model.economy.gems += amount;

		this.model.economy.history.push({
			addOrDel: 'add',
			currency: 'gem',
			amount,
			reason,
			from,
		});
		this.model.markModified('economy.history');

		return this.model.economy.gems;
	}

	remove(amount: number, reason: string, from: string): number {
		amount = Math.round(amount);
		this.model.economy.gems -= amount;

		this.model.economy.history.push({
			addOrDel: 'del',
			currency: 'gem',
			amount,
			reason,
			from,
		});
		this.model.markModified('economy.history');

		return this.model.economy.gems;
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
			currency: 'gem';
			addOrDel: 'add' | 'del';
			reason: string;
			from: string;
		},
	] {
		return this.model.economy.history.filter((v) => {
			return v.currency === 'gem';
		}) as [
			{
				amount: number;
				currency: 'gem';
				addOrDel: 'add' | 'del';
				reason: string;
				from: string;
			},
		];
	}
}
