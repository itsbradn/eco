import { randomInt } from 'crypto';
import { UserDataManager } from './BaseDataManager';

export class UserLevelManager extends UserDataManager {
	get experience() {
		return this.model.user.experience;
	}

	get level() {
		return Math.floor(Math.floor(95 + Math.sqrt(9025 + 380 * this.experience)) / 190);
	}

	get experienceNeeded() {
		const nextLevel = Math.floor(Math.floor(95 + Math.sqrt(9025 + 380 * this.experience)) / 190) + 1;
		return 95 * nextLevel * nextLevel - 95 * nextLevel;
	}

	addExperience(amount: number) {
		this.model.user.experience += amount;
		return this.model.user.experience;
	}

	delExperience(amount: number) {
		this.model.user.experience -= amount;
		return this.model.user.experience;
	}

	setExperience(amount: number) {
		this.model.user.experience = amount;
		return this.model.user.experience;
	}

	addRandExperience(min: number = 10, max: number = 40) {
		const randExp = randomInt(min, max + 1);
		const oldLevel = this.level;
		this.addExperience(randExp);
		const newLevel = this.level;
		return {
			added: randExp,
			leveledUp: newLevel > oldLevel,
		}
	}
}
