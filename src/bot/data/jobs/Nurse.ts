import { Job } from '../../structures';

export const Nurse: Job = {
	name: 'Nurse',
	workRequirement: 1200,
	messages: {
		perfect: [
			'You got nurse of the month! You helped the most patients.',
			'Everyone is praising you for your magnificent nursing skills.',
		],
		good: ['Your patient was satisfied with your care.', 'The patient fell better after the treatment.'],
		bad: [
			'Your patient passed away due to your lack of skill, maybe attend some more nursing school before you apply again.',
			'While assisting a surgeon, you handed them the wrong tool, causing a malpractice. So you were fired!',
		],
	},
};
