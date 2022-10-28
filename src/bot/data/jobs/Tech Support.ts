import { Job } from '../../structures';

export const TechSupport: Job = {
	name: 'Tech Support',
	workRequirement: 3500,
	messages: {
		perfect: [
			'You successfully secured somebodies OS!',
			'You did such an amazing job you got a bonus from your employer!',
		],
		good: ['You helped an elderly person exit fullscreen.', 'You fixed a bug on a solitare website.'],
		bad: ['You stole somebodies SSN.', 'You ended up downloading more malware instead of getting rid of it.'],
	},
};
