export interface Job {
	name: string;
	workRequirement: number | 'none';
	messages: {
		perfect: Array<string>;
		good: Array<string>;
		bad: Array<string>;
	}
}