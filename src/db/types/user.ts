import { itemType } from '../../bot/data/items';
import { jobType } from '../../bot/data/jobs';

export interface IUser {
	user: {
		id: string;
		firstCommandAt: Date;
		lastUsed: Date;
		schemaVer: number;
		experience: number;
	};
	economy: {
		coins: number;
		gems: number;
		history: [
			{
				amount: number;
				currency: 'coin' | 'gem';
				addOrDel: 'add' | 'del';
				reason: string;
				from: string;
			},
		];
	};
	storage: {
		items: [
			{
				name: itemType;
				amount: number;
			},
		];
		pets: [
			{
				name: string;
				nickname: string;
				active: boolean;
				modifier: 'NONE' | 'SHINY';
				experience: number;
			},
		];
	};
	meta: {
		health: {
			current: number;
			max: number;
			lastLostAt: Date;
		};
		weapon: {
			current: string;
		};
		runes: {
			maxActive: number;
			active: string[];
		};
		cooldowns: [
			{
				name: string;
				endsAt: Date;
				lastSetAt: Date;
				history: {
					name: string;
					setAt: Date;
					expiredAt: Date;
				}[];
			},
		];
	};
	work: {
		pastAnswers:
			{
				at: Date;
				job: string;
				word: string;
				typed: string;
				typedCorrectly: boolean;
				gotFired: boolean;
				gotSick: boolean;
				wasPerfect: boolean;
				expGained: number;
				didLevelUp: boolean;
				gotRaise: boolean;
			}[];
		timesWorked: number;
		timesSick: number;
		timesFired: number;
		timesPerfect: number;
		lastWorkedAt?: Date;
		job: jobType;
		raise: {
			level: number;
			timesWorkedSinceLast: number;
			lastRaiseAt?: Date;
		};
	};
	mining: {
		mineHistory:
			{
				at: Date;
				material: itemType;
				damageDone: number;
				gotArtifact: boolean;
				gotFossil: boolean;
				brokeOre: boolean;
				brokePickaxe: boolean;
				pickaxeUsed: string;
				pickaxeUsesSinceLast: number;
				chiselUsed: string;
				chiselUsesSinceLast: number;
				materialGained: number;
				expGained: number;
				didLevelUp: boolean;
			}[],
		timesMined: number;
		timesMinedWithPickaxe: 
			{
				name: itemType;
				timesUsed: number;
			}[],
		timesMinedOre:
			{
				name: itemType;
				timesMined: number;
				amountMined: number;
			}[],
		lastMinedAt?: Date;
		lastPickaxeBrokeAt?: Date;
		timesMinedSinceLastPickaxeBroke: number;
		timesMinedSinceLastChiselBroke: number;
		pickaxesBroken: 
			{
				name: itemType;
				timesBroke: number;
			}[]
		artifactsFound: number;
		fossilsFound: number;
	};
	fishing: {
		fishHistory:
			{
				at: Date;
				rod: string;
				fish: string;
				amountFished: number;
				expGained: number;
				didLevelUp: boolean;
				gotWaterBottle: boolean;
			}[]
		timesFished: number;
		lastFishedAt?: Date;
		lastBrokeRodAt?: Date;
		timesFishedSinceLastRodBroke: number;
	};
	dungeons: {
		history: [
			{
				at: Date;
				dungeonFought: string;
				startingHealth: number;
				weaponUsed: string;
				monstersFought: [
					{
						name: string;
						health: number;
						damageDone: number;
						damageToMonsterHistory: [
							{
								moveUsed: string;
								damageDone: number;
								wasBlocked: boolean;
								wasCrit: boolean;
								damageBlocked: number;
								didKill: boolean;
								drops: [
									{
										type: string;
										name: string;
										amount: number;
									},
								];
							},
						];
						damageToPlayerHistory: [
							{
								moveUsed: string;
								damageDone: number;
								wasBlocked: boolean;
								wasCrit: boolean;
								damageBlocked: number;
								didKill: boolean;
							},
						];
					},
				];
				didPass: boolean;
				coinsLost: number;
				didRun: boolean;
				rewards: [
					{
						type: string;
						name: string;
						amount: number;
					},
				];
				healthLeft: number;
			},
		];
	};
	quests: {
		weeklyResetAt?: Date;
		weeklys?: Array<unknown>;
		dailyResetAt?: Date;
		dailys?: Array<unknown>;
	};
	location: {
		current: string;
		arrivedAt: Date;
		history: Array<any>;
	};
}
