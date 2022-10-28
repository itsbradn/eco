import { Job } from '../../structures';

export const Bartender: Job = {
	name: 'Bartender',
	workRequirement: 60,
	messages: {
		perfect: ['Someone got so drunk they tipped extra!', 'Someone bought a lot of alcohol... A lot...'],
		good: ['You sold a lot of drinks today.', 'Someone bought 10 drinks.'],
		bad: ["You sold someone too many drinks and the owners aren't happy.", 'You gave someone alcohol poisoning...'],
	},
};
