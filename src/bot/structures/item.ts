import { itemType } from "../data/items";

export interface Item {
	name: string;
	emoji: string;
	description: string;
	category: string;
	tool?: ToolData;
	obtainable?: {
		artifact: false | number;
	};
	rune?: RuneData;
	box?: BoxData;
	crafting?: CraftingData;
}

enum RuneModifierTypes {
	Health,
	Damage,
	WorkMoney,
	WorkCooldown,
	WorkSickCooldown,
	PickaxeOreCount,
	FishingRodFishCount,
}

interface RuneModifierAmount {
	type: RuneModifierTypes;
	amount: number;
}

interface RuneModifierPercent {
	type: RuneModifierTypes;
	percent: number;
}

type RuneModifier = RuneModifierAmount | RuneModifierPercent;

interface RuneData {
	modifiers: RuneModifier[];
}


interface PickaxeItemData {
	type: 'pickaxe';
	minDamage: number;
	maxDamage: number;
	doubleDamageChance: number;
	power: number;
	luck: number;
	durability: number;
	speed: number;
}

interface ChiselItemData {
	type: 'chisel';
	damage: number;
}

interface FishingRodItemData {
	type: 'fishing rod';
	power: number;
	speed: number;
	luck: number;
	durability: number;
}

interface SwordItemData {
	type: 'sword' | 'dagger' | 'bow';
	attacks: [];
}

type ToolData = PickaxeItemData | ChiselItemData | FishingRodItemData | SwordItemData;


interface BoxData {
	openAt: BoxOpenLocations;
	levelRequirement: number;
	items: BoxItemData[];
}

export enum BoxOpenLocations {
	Any,
	Blacksmith,
	Fisherman,
}

interface BoxItemData {
	chance: number;
	minAmount: number;
	maxAmount: number;
	item: itemType;
}


interface CraftingData {
	levelRequirement: number;
	itemRequirements: CraftingItemRequirementData[];
}

interface CraftingItemRequirementData {
	amount: number;
	item: itemType;
}