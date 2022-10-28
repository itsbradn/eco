import { Job } from '../../structures';

export const Mechanic: Job = {
	name: 'Mechanic',
	workRequirement: 900,
	messages: {
		perfect: [
			'You did a excellent job! The car you repaired looks brand new.',
			'You repaired the car engine, there were no drawbacks.',
		],
		good: ['You successfully repaired a car.', 'The customer was satisfied with your mediocre service.'],
		bad: [
			"You did a horrible job. You're not even trusted to fix a bicycle.",
			'You left your wrench in the car engine, causing an accident.',
		],
	},
};
