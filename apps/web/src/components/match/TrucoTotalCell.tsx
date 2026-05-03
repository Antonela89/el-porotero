export const TrucoTotalCell = ({ total, status }: { total: number, status: any }) => {
    const isBuenas = status.label === 'Buenas';
    return (
        <td className="p-5 border-r border-white/5">
            <div className="flex flex-col items-center justify-center">
                <span className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isBuenas ? 'text-primary' : 'text-text-muted opacity-60'}`}>
                    {status.label}
                </span>
                <span className={`text-4xl font-display ${isBuenas ? 'text-primary scale-110' : 'text-text-main'}`}>
                    {status.val}
                </span>
                <span className="text-[9px] opacity-30 mt-1 font-mono">{total} PTS</span>
            </div>
        </td>
    );
};