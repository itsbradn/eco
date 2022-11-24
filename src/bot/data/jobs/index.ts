import { Begger } from './Begger';
import { Janitor } from './Janitor';
import { Cashier } from './Cashier';
import { Bartender } from './Bartender';
import { Server } from './Server';
import { Assistant } from './Assistant';
import { Teacher } from './Teacher';
import { Mechanic } from './Mechanic';
import { Nurse } from './Nurse';
import { Accountant } from './Accountant';
import { TechSupport } from './Tech Support';
import { SoftwareDeveloper } from './Software Developer';
import { Job } from '../../structures';

export const jobs = {
	Begger,
	Janitor,
	Cashier,
	Bartender,
	Server,
	Assistant,
	Teacher,
	Mechanic,
	Nurse,
	Accountant,
	TechSupport,
	SoftwareDeveloper,
};

export type jobType = keyof typeof jobs;

const itemKeys = Object.keys(jobs);
const itemValues = Object.values(jobs);
export const jobArray: { key: jobType; value: Job }[] = [];
for (let i = 0; i < itemKeys.length; i++) {
	const itemValue = itemValues[i];
	const itemKey = itemKeys[i];
	if (!itemValue || !itemKey) continue;
	jobArray.push({ key: itemKey as jobType, value: itemValue });
}
