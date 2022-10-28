import { Job } from '../../structures';

export const Assistant: Job = {
	name: 'Assistant',
	workRequirement: 340,
	messages: {
		perfect: [
			'You worked for Bill Gates today and he gave you a giant tip',
			'You worked very hard today and were given a bonus!',
		],
		good: ['You worked as an assistant for a law firm.', 'You filed taxes all day.'],
		bad: ['You couldnt find any work.', "You're literally useless. How did you not find a single job."],
	},
};
