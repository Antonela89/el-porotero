import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import type { UserDTO } from '@el-porotero/shared';

interface IUserMethods {
	comparePassword(password: string): Promise<boolean>;
}

type UserModelType = Model<UserDTO, {}, IUserMethods>;

const userSchema = new Schema<UserDTO, UserModelType>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: '' },
	},
	{ timestamps: true },
);

// Metodo para comparar contraseñas
userSchema.methods.comparePassword = async function (password: string) {
	return bcrypt.compare(password, this.password);
};

export const UserModel = model<UserDTO, UserModelType>('User', userSchema);
