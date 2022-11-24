import { jobs, jobType } from '../../data/jobs';
import { percentChance } from '../../utils/number';
import { UserDataManager } from './BaseDataManager';

export class UserWorkManager extends UserDataManager {
	setJob(job: jobType) {
		return (this.model.work.job = job);
	}

	get job(): jobType {
		return this.model.work.job;
	}

	get raise() {
		if (this.model.work.raise.timesWorkedSinceLast > 25) {
			this.model.work.raise.timesWorkedSinceLast = 0;
			this.model.work.raise.level += 1;
			this.model.work.raise.lastRaiseAt = new Date(Date.now());
			return {
				raised: true,
				level: this.model.work.raise.level,
			};
		}
		return {
			raised: false,
			level: this.model.work.raise.level,
		};
	}

	setRaise(level: number) {
		this.model.work.raise.lastRaiseAt = new Date();
		this.model.work.raise.timesWorkedSinceLast = 0;
		this.model.work.raise.level = level;
	}

	get count(): number {
		return this.model.work.timesWorked;
	}

	get pay(): number {
		const job = jobs[this.model.work.job];
		const basePay =
			job.name === 'Begger' ? 20 : (job.workRequirement === 'none' ? 0 : job.workRequirement) * 1.75 + 500;
		const raiseBonus = this.raise.level / 100;
		const fullBonus = raiseBonus;

		return Math.floor(basePay * (1 + fullBonus));
	}

	get perfectPay(): number {
		const basePay = this.pay;

		return Math.floor(basePay * 1.5);
	}

	addWork(
		word: string,
		typed: string,
	): { status: 'success' | 'perfect' | 'fired' | 'sick' | 'failed'; didLevelUp: boolean; gotRaise: boolean } {
		this.model.work.timesWorked += 1;
		this.model.work.raise.timesWorkedSinceLast += 1;
		this.model.work.lastWorkedAt = new Date();

		const at = new Date();
		const job = this.job;
		const typedCorrectly = word === typed;
		const gotFired = typedCorrectly ? false : percentChance(30);
		const gotSick = gotFired ? false : percentChance(2);
		const wasPerfect = typedCorrectly && !gotSick ? percentChance(4) : false;
		const addExp = typedCorrectly
			? this.userModule.level.addRandExperience()
			: this.userModule.level.addRandExperience(5, 10);
		const expGained = addExp.added;
		const didLevelUp = addExp.leveledUp;
		const gotRaise = typedCorrectly ? this.raise.raised : false;

		if (gotFired) {
			this.model.work.job = 'Begger';
			this.model.work.timesFired += 1;
			this.setRaise(0);
		}
		if (gotSick) this.model.work.timesSick += 1;
		if (wasPerfect) this.model.work.timesPerfect += 1;

		this.model.work.pastAnswers.push({
			at,
			job,
			word,
			typed,
			typedCorrectly,
			gotFired,
			gotSick,
			wasPerfect,
			expGained,
			didLevelUp,
			gotRaise,
		});
		this.model.markModified('work.pastAnswers');

		return {
			status: typedCorrectly
				? gotSick
					? 'sick'
					: wasPerfect
					? 'perfect'
					: 'success'
				: gotFired
				? 'fired'
				: gotSick
				? 'sick'
				: 'failed',
			didLevelUp,
			gotRaise,
		};
	}
}
