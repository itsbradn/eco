import { Job } from '../../structures';

export const SoftwareDeveloper: Job = {
	name: 'Software Developer',
	workRequirement: 6000,
	messages: {
		perfect: [
			'The software you designed peaked the interest of a large tech company, and they were very pleased by your work.',
			'Your client was very happy with your job and wanted to compensate you extra for your hard work.',
		],
		good: ['You finished the task that you were assigned for the project.', 'You fixed a bug, the software works now.'],
		bad: [
			"One thing led to another... you didn't fix the bug, but actually even worsened it's impact on the software.",
			"You somehow permanently deleted the software you worked on, and your boss decided he didn't need someone so clumsy like you.",
		],
	},
};
