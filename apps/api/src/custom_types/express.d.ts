import { UserDTO } from '@el-porotero/shared';

declare global {
	namespace Express {
		interface Request {
			user?: UserDTO;
		}
	}
}

export {};
