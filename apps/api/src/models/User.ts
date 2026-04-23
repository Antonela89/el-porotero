import { Schema, model } from 'mongoose';
import { UserDTO } from '@el-porotero/shared'; 
const userSchema = new Schema<UserDTO>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: '' },
	},
	{ timestamps: true },
);

export const UserModel = model('User', userSchema);
