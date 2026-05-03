import { toast } from 'sonner';

export const notify = {
	success: (msg: string) => toast.success(msg, { position: 'top-center' }),
	error: (msg: string) => toast.error(msg, { position: 'top-center' }),
	info: (msg: string) => toast(msg, { icon: '🃏' }),
};
