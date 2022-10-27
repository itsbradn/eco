import { model } from 'mongoose';
import { userSchema } from './user';

export const userModel = model('ecobot-user', userSchema);
