import { HEALTH_REGEN_RATE } from '../../../configs';
import { UserDataManager } from './BaseDataManager';

export class UserHealthManager extends UserDataManager {
	get health() {
		return this.model.meta.health.current;
	}

	get maxHealth() {
		return this.model.meta.health.max;
	}

	damage(amount: number) {
		this.model.meta.health.lastLostAt = new Date(Date.now());
		this.model.meta.health.current -= amount;
		if (this.health < 0) this.model.meta.health.current = 0;

		return this.health;
	}

	heal(amount: number) {
		this.model.meta.health.current += amount;
		if (this.health > this.maxHealth) this.model.meta.health.current = this.maxHealth;

		return this.health;
	}

	checkRegeneration() {
		if (this.health == this.maxHealth) return this.health;
		const timeSince = Math.floor(
			(Date.now() - (this.model.meta.health.lastLostAt ?? new Date()).getTime()) / 1000 / 60,
		);
		return this.heal(HEALTH_REGEN_RATE * timeSince);
	}

	get dead() {
		return this.health === 0;
	}
}
