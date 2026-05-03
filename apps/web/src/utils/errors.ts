import axios from 'axios';
import { toast } from 'sonner';

export const handleApiError = (err: unknown, defaultMsg: string) => {
	let message = defaultMsg;
	if (axios.isAxiosError(err)) {
		message = err.response?.data?.message || err.message;
	}
	toast.error(message);
	console.error(err);
};
