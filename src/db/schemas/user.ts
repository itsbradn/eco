import { Schema } from 'mongoose';
import { IUser } from '../types/user';
import { validateAddOrDel, validateCurrency, validateInteger, validatePetModifier } from '../utils';

export const userSchema = new Schema<IUser>({
	user: {
		id: {
			Type: String,
			required: true,
		},
		firstCommandAt: {
			Type: Date,
			default: new Date(Date.now()),
		},
		lastUsed: {
			type: Date,
			default: new Date(Date.now()),
		},
		schemaVer: {
			type: Number,
			default: 1,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
		},
		experience: {
			type: Number,
			default: 1,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
		},
	},
	economy: {
		coins: {
			type: Number,
			default: 500,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
		},
		gems: {
			type: Number,
			default: 500,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
		},
		history: {
			type: [
				{
					amount: {
						// Amount added or removed
						type: Number,
						required: true,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
					},
					addOrDel: {
						// Did you add or remove money
						type: String,
						required: true,
						validate: validateAddOrDel,
					},
					currency: {
						// Did you add or remove money
						type: String,
						required: true,
						validate: validateCurrency,
					},
					reason: {
						// Why was this change made
						type: String,
						required: true,
					},
					from: {
						// What part of the bot executed this change
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	storage: {
		items: {
			type: [
				{
					name: {
						type: String,
						required: true,
					},
					amount: {
						type: Number,
						required: true,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
					},
				},
			],
			default: [],
		},
		pets: {
			type: [
				{
					name: {
						type: String,
						required: true,
					},
					nickname: {
						type: String,
						default: '',
					},
					active: {
						type: Boolean,
						default: false,
					},
					modifier: {
						type: String,
						default: 'NONE',
						validate: validatePetModifier,
					},
					experience: {
						type: Number,
						required: true,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
					},
				},
			],
		},
	},
	meta: {
		health: {
			current: {
				type: Number,
				default: 50,
				get: (v: number) => Math.round(v),
				set: (v: number) => Math.round(v),
				validate: validateInteger,
			},
			max: {
				type: Number,
				default: 50,
				get: (v: number) => Math.round(v),
				set: (v: number) => Math.round(v),
				validate: validateInteger,
			},
			lastLostAt: {
				type: Date,
				default: new Date(Date.now()),
			},
		},
		weapon: {
			current: {
				type: String,
				default: 'NONE',
			},
		},
		runes: {
			maxActive: {
				type: Number,
				get: (v: number) => Math.round(v),
				set: (v: number) => Math.round(v),
				validate: validateInteger,
				default: 2,
			},
			active: {
				type: [String],
				default: [],
			},
		},
	},
	work: {
		pastAnswers: {
			type: [
				{
					at: Date,
					job: String,
					word: String,
					typed: String,
					typedCorrectly: Boolean,
					gotFired: Boolean,
					gotSick: Boolean,
					wasPerfect: Boolean,
					expGained: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						required: true,
					},
					didLevelUp: Boolean,
					gotRaise: Boolean,
				},
			],
			default: [],
		},
		timesWorked: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		timesSick: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		timesFired: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		timesPerfect: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		lastWorkedAt: Date,
		job: {
			type: String,
			default: 'Janitor',
		},
		raise: {
			level: {
				type: Number,
				get: (v: number) => Math.round(v),
				set: (v: number) => Math.round(v),
				validate: validateInteger,
				default: 0,
			},
			timesWorkedSinceLast: {
				type: Number,
				get: (v: number) => Math.round(v),
				set: (v: number) => Math.round(v),
				validate: validateInteger,
				default: 0,
			},
			lastRaiseAt: Date,
		},
	},
	mining: {
		mineHistory: {
			type: [
				{
					at: Date,
					material: String,
					damageDone: {
						type: Number,
						timesMined: {
							type: Number,
							get: (v: number) => Math.round(v),
							set: (v: number) => Math.round(v),
							validate: validateInteger,
							default: 0,
						},
						required: true,
					},
					gotArtifact: Boolean,
					gotFossil: Boolean,
					brokeOre: Boolean,
					brokePickaxe: Boolean,
					pickaxeUsed: String,
					pickaxeUses: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					chiselUsed: String,
					chiselUses: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					materialGained: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					expGained: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					didLevelUp: Boolean,
				},
			],
			default: [],
		},
		timesMined: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		timesMinedWithPickaxe: {
			type: [
				{
					name: String,
					timesUsed: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
				},
			],
			default: [],
		},
		timesMinedOre: {
			type: [
				{
					name: String,
					timesMined: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					amountMined: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
				},
			],
			default: [],
		},
		lastMinedAt: Date,
		lastPickaxeBrokeAt: Date,
		timesMinedSinceLastPickaxeBroke: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		pickaxesBroken: {
			type: [
				{
					name: String,
					timesBroke: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
				},
			],
			default: [],
		},
		artifactsFound: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		fossilsFound: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
	},
	fishing: {
		fishHistory: {
			type: [
				{
					at: Date,
					rod: String,
					fish: String,
					amountFished: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					expGained: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					didLevelUp: Boolean,
					gotWaterBottle: Boolean,
				},
			],
			default: [],
		},
		timesFished: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
		lastFishedAt: Date,
		lastBrokeRodAt: Date,
		timesFishedSinceLastRodBroke: {
			type: Number,
			get: (v: number) => Math.round(v),
			set: (v: number) => Math.round(v),
			validate: validateInteger,
			default: 0,
		},
	},
	dungeons: {
		history: {
			type: [
				{
					at: Date,
					dungeonFought: String,
					startingHealth: Number,
					weaponUsed: String,
					monstersFought: {
						type: [
							{
								name: String,
								health: {
									type: Number,
									get: (v: number) => Math.round(v),
									set: (v: number) => Math.round(v),
									validate: validateInteger,
									default: 0,
								},
								damageDone: {
									type: Number,
									get: (v: number) => Math.round(v),
									set: (v: number) => Math.round(v),
									validate: validateInteger,
									default: 0,
								},
								damageToMonsterHistory: {
									type: [
										{
											moveUsed: String,
											damageDone: {
												type: Number,
												get: (v: number) => Math.round(v),
												set: (v: number) => Math.round(v),
												validate: validateInteger,
												default: 0,
											},
											wasBlocked: Boolean,
											wasCrit: Boolean,
											damageBlocked: {
												type: Number,
												get: (v: number) => Math.round(v),
												set: (v: number) => Math.round(v),
												validate: validateInteger,
												default: 0,
											},
											didKill: Boolean,
											drops: {
												type: [
													{
														type: String,
														name: String,
														amount: {
															type: Number,
															get: (v: number) => Math.round(v),
															set: (v: number) => Math.round(v),
															validate: validateInteger,
															default: 0,
														},
													},
												],
												default: [],
											},
										},
									],
									default: [],
								},
								damageToPlayerHistory: {
									type: [
										{
											moveUsed: String,
											damageDone: {
												type: Number,
												get: (v: number) => Math.round(v),
												set: (v: number) => Math.round(v),
												validate: validateInteger,
												default: 0,
											},
											wasBlocked: Boolean,
											wasCrit: Boolean,
											damageBlocked: {
												type: Number,
												get: (v: number) => Math.round(v),
												set: (v: number) => Math.round(v),
												validate: validateInteger,
												default: 0,
											},
											didKill: Boolean,
										},
									],
									default: [],
								},
							},
						],
						default: [],
					},
					didPass: Boolean,
					coinsLost: {
						type: Number,
						get: (v: number) => Math.round(v),
						set: (v: number) => Math.round(v),
						validate: validateInteger,
						default: 0,
					},
					didRun: Boolean,
					rewards: {
						type: [
							{
								type: String,
								name: String,
								amount: {
									type: Number,
									get: (v: number) => Math.round(v),
									set: (v: number) => Math.round(v),
									validate: validateInteger,
									default: 0,
								},
							},
						],
						default: [],
					},
					healthLeft: Number,
				},
			],
			default: [],
		},
	},
	quests: {
		weeklyResetAt: Date,
		weeklys: Array,
		dailyResetAt: Date,
		dailys: Array,
	},
	location: {
		current: {
			type: String,
			default: 'North America',
		},
		arrivedAt: Date,
		history: Array,
	},
});
