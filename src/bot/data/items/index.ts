import { Item } from "../../structures/item";
import { BoxItems } from "./Boxes";
import { MaterialItems } from "./Materials";
import { MiningItems } from "./Mining";

export const items = {
	...MiningItems,
	...MaterialItems,
	...BoxItems,
}

export type itemType = keyof typeof items;


const itemKeys = Object.keys(items);
const itemValues = Object.values(items);
export const itemArray: { key: itemType; value: Item }[] = [];
for (let i = 0; i < itemKeys.length; i++) {
	const itemValue = itemValues[i];
	const itemKey = itemKeys[i];
	if (!itemValue || !itemKey) continue;
	itemArray.push({ key: itemKey as itemType, value: itemValue });
}

