import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';
import { IMatch, IRound } from '@el-porotero/shared';
import { IconButton } from '@/components';
import { getShortName } from '@/utils';

const MotionDiv = motion.create('div');

interface HistoryDrawerProps {
    match: IMatch;
    allNames: string[];
    isOpen: boolean;
    onClose: () => void;
    onEdit: (n: number) => void;
    onDelete: (n: number) => void;
}

export const HistoryDrawer = ({ allNames, isOpen, onClose, match, onEdit, onDelete }: HistoryDrawerProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <MotionDiv
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="drawer-overlay"
                    />
                    {/* Content */}
                    <MotionDiv
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="history-drawer"
                    >
                        <div className="drawer-header-row">
                            <h3 className="text-xl font-bold">Historial de Rondas</h3>
                            <IconButton icon={<X />} title="Cerrar" onClick={onClose} variant="ghost" />
                        </div>

                        <div className="history-table-container custom-scrollbar">
                            <table className="history-table">
                                <thead className="text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="w-10">#</th>
                                        {match.players.map(p => (
                                            <th key={p.name}>
                                                <div className="history-player-header">
                                                    <span className="initials-pill">
                                                        {getShortName(p.name, allNames)}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                        <th className="w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...match.rounds].reverse().map((round: IRound) => (
                                        <tr key={round.roundNumber}>
                                            <td className="round-index">{round.roundNumber}</td>
                                            {match.players.map(p => {
                                                const s = round.scores.find(score => score.playerName === p.name);
                                                return (
                                                    <td key={p.name} className="round-points">
                                                        {s?.pointsAdded || 0}
                                                    </td>
                                                );
                                            })}
                                            <td className="round-actions-cell">
                                                <div className="flex gap-1 justify-end">
                                                    <button className="btn-edit-inline" onClick={() => onEdit(round.roundNumber)}>
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button className="btn-delete-inline" onClick={() => onDelete(round.roundNumber)}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
    );
};