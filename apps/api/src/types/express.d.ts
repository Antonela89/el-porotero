import { UserDTO } from '@el-porotero/shared';

declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: string;
				username: string;
			};
		}
	}
}
