import { itemArray, itemType } from '../../data/items';
import { Item } from '../../structures/item';
import { percentChance } from '../../utils/number';
import { UserDataManager } from './BaseDataManager';

export class UserMineManager extends UserDataManager {
	get pickaxe(): Item | undefined {
		let pickaxes = itemArray.filter((v) => {
			if (!v.value.tool || v.value.tool.type !== 'pickaxe') return false;
			if (this.userModule.inventory.get(v.key) < 1) return false;

			return true;
		});

		pickaxes = pickaxes.sort((a, b) => {
			if (!a.value.tool || !b.value.tool || a.value.tool.type !== 'pickaxe' || b.value.tool.type !== 'pickaxe')
				return -1;
			return b.value.tool.power - a.value.tool.power;
		});
		pickaxes = pickaxes.sort((a, b) => {
			if (!a.value.tool || !b.value.tool || a.value.tool.type !== 'pickaxe' || b.value.tool.type !== 'pickaxe')
				return -1;
			return b.value.tool.maxDamage - a.value.tool.maxDamage;
		});
		pickaxes = pickaxes.sort((a, b) => {
			if (!a.value.tool || !b.value.tool || a.value.tool.type !== 'pickaxe' || b.value.tool.type !== 'pickaxe')
				return -1;
			return b.value.tool.minDamage - a.value.tool.minDamage;
		});

		const chosenPickaxe = pickaxes[0];

		if (!chosenPickaxe || !chosenPickaxe.value.tool || chosenPickaxe.value.tool.type !== 'pickaxe') return;

		return chosenPickaxe.value;
	}

	get chisel() {
		let chisels = itemArray.filter((v) => {
			if (!v.value.tool || v.value.tool.type !== 'chisel') return false;
			if (this.userModule.inventory.get(v.key) < 1) return false;

			return true;
		});
		chisels = chisels.sort((a, b) => {
			if (!a.value.tool || !b.value.tool || a.value.tool.type !== 'chisel' || b.value.tool.type !== 'chisel') return -1;
			return b.value.tool.damage - a.value.tool.damage;
		});

		return chisels[0]?.value;
	}

	get usesSinceLastBreak() {
		return {
			pickaxe: this.model.mining.timesMinedSinceLastPickaxeBroke,
			chisel: this.model.mining.timesMinedSinceLastChiselBroke,
		};
	}

	get shouldBreakData() {
		const pickaxe = this.pickaxe;
		const pickaxeUsed = itemArray.find((v) => v.value.name === pickaxe?.name)?.key;
		if (!pickaxe || !pickaxe.tool || pickaxe.tool.type !== 'pickaxe' || !pickaxeUsed) {
			return {
				pickaxe: false,
				chisel: false,
			};
		}
		const pickaxeBroke = percentChance((this.usesSinceLastBreak.pickaxe - pickaxe.tool.durability * 30) / 10);

		if (pickaxeBroke) {
			const found = this.model.mining.pickaxesBroken.find((v) => v.name === pickaxeUsed);

			if (!found) {
				this.model.mining.pickaxesBroken.push({
					name: pickaxeUsed,
					timesBroke: 1,
				});
			} else {
				const index = this.model.mining.pickaxesBroken.indexOf(found);

				this.model.mining.pickaxesBroken[index] = {
					name: found.name,
					timesBroke: found.timesBroke + 1,
				};
			}

			this.userModule.inventory.del(pickaxeUsed, 1);
			this.model.mining.timesMinedSinceLastPickaxeBroke = 0;

			this.model.markModified('mining.pickaxesBroken');
		}

		return {
			pickaxe: pickaxeBroke,
			chisel: false,
		};
	}

	addMine(material: itemType, damageDone: number, brokeOre: boolean, materialGained: number) {
		const pickaxe = this.pickaxe;
		const pickaxeUsed = itemArray.find((v) => v.value.name === pickaxe?.name)?.key || 'NONE';
		const chisel = this.chisel;
		const chiselUsed = itemArray.find((v) => v.value.name === chisel?.name)?.key || 'NONE';
		const gotArtifact = brokeOre ? false : percentChance(3);
		const gotFossil = brokeOre ? false : percentChance(1);

		if (!brokeOre) {
			const found = this.model.mining.timesMinedOre.find((v) => v.name === material);
			found
				? (this.model.mining.timesMinedOre[this.model.mining.timesMinedOre.indexOf(found)] = {
						name: found.name,
						timesMined: found.timesMined + 1,
						amountMined: found.amountMined + materialGained,
				  })
				: this.model.mining.timesMinedOre.push({ name: material, timesMined: 1, amountMined: materialGained });
		}
		if (pickaxeUsed !== 'NONE') {
			const found = this.model.mining.timesMinedWithPickaxe.find((v) => v.name === pickaxeUsed);
			found
				? (this.model.mining.timesMinedWithPickaxe[this.model.mining.timesMinedWithPickaxe.indexOf(found)] = {
						name: found.name,
						timesUsed: found.timesUsed + 1,
				  })
				: this.model.mining.timesMinedWithPickaxe.push({ name: pickaxeUsed, timesUsed: 1 });
		}
		this.model.mining.lastMinedAt = new Date();
		this.model.mining.timesMinedSinceLastChiselBroke += 1;
		this.model.mining.timesMinedSinceLastPickaxeBroke += 1;
		if (gotArtifact) this.model.mining.artifactsFound += 1;
		if (gotFossil) this.model.mining.fossilsFound += 1;

		const brokePickaxe = this.shouldBreakData.pickaxe;
		const expData = brokeOre
			? this.userModule.level.addRandExperience(5, 15)
			: this.userModule.level.addRandExperience(10, 25);
		const expGained = expData.added;
		const didLevelUp = expData.leveledUp;

		this.model.mining.mineHistory.push({
			at: new Date(),
			material,
			damageDone,
			gotArtifact,
			gotFossil,
			brokeOre,
			brokePickaxe,
			pickaxeUsed,
			pickaxeUsesSinceLast: this.usesSinceLastBreak.pickaxe,
			chiselUsed,
			chiselUsesSinceLast: this.usesSinceLastBreak.chisel,
			materialGained,
			expGained,
			didLevelUp,
		});

		return {
			at: new Date(),
			material,
			damageDone,
			gotArtifact,
			gotFossil,
			brokeOre,
			brokePickaxe,
			pickaxeUsed,
			pickaxeUsesSinceLast: this.usesSinceLastBreak.pickaxe,
			chiselUsed,
			chiselUsesSinceLast: this.usesSinceLastBreak.chisel,
			materialGained,
			expGained,
			didLevelUp,
		};
	}
}
