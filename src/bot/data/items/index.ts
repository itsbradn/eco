import { BoxItems } from "./Boxes";
import { MaterialItems } from "./Materials";
import { MiningItems } from "./Mining";

export const items = {
	...MiningItems,
	...MaterialItems,
	...BoxItems,
}

export type itemType = keyof typeof items;