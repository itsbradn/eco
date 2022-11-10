import { itemType } from '../../data/items';
import { UserDataManager } from './BaseDataManager';

export class UserInventoryManager extends UserDataManager {
	get(name: itemType) {
		const itemFound = this.model.storage.items.find((v) => v.name === name);
		if (!itemFound) return 0;
		return itemFound.amount;
	}

	get inventory() {
		return this.model.storage.items;
	}

	add (name: itemType, amount: number) {
		const itemFound = this.model.storage.items.find((v) => v.name === name);
		if (!itemFound) {
			this.model.storage.items.push({
				name,
				amount,
			});

			this.model.markModified('storage.items');

			return amount;
		}

		const added = {
			name,
			amount: itemFound.amount + amount,
		}

		this.model.storage.items[this.model.storage.items.indexOf(itemFound) ?? 0] = added;
		this.model.markModified('storage.items');
		return added.amount;
	}

	del (name: itemType, amount: number) {
		const itemFound = this.model.storage.items.find((v) => v.name === name);
		if (!itemFound) {
			this.model.storage.items.push({
				name,
				amount: 0,
			});

			this.model.markModified('storage.items');

			return 0;
		}

		const removed = {
			name,
			amount: itemFound.amount - amount,
		}

		this.model.storage.items[this.model.storage.items.indexOf(itemFound) ?? 0] = removed;
		this.model.markModified('storage.items');
		return removed.amount;
	}
}
