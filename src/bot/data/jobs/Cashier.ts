import { Job } from '../../structures';

export const Cashier: Job = {
	name: 'Cashier',
	workRequirement: 20,
	messages: {
		perfect: ['Someone tipped you their extra cash!', 'You worked overtime and got paid!'],
		good: ['You had a good day working and got paid.', 'You sold a lot of cheese puffs today...'],
		bad: ['You only sold to 1 person... Thats it??', 'Someone complained you threw their food on the ground.'],
	},
};
