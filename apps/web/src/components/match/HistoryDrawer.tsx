import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';
import { IMatch, IRound } from '@el-porotero/shared';
import { IconButton } from '@/components';

interface HistoryDrawerProps {
    match: IMatch;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (n: number) => void;
    onDelete: (n: number) => void;
}

export const HistoryDrawer = ({ isOpen, onClose, match, onEdit, onDelete }: HistoryDrawerProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    />
                    {/* Content */}
                    <motion.div 
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-slate-800">
                            <h3 className="text-xl font-bold">Historial de Rondas</h3>
                            <IconButton icon={<X />} title="Historial" onClick={onClose} variant="ghost" />
                        </div>
                        
                        <div className="overflow-auto p-4">
                            <table className="w-full text-center border-collapse">
                                <thead className="text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-2">#</th>
                                        {match.players.map(p => <th key={p.name} className="p-2">{p.name}</th>)}
                                        <th className="p-2 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {match.rounds.map((round: IRound) => (
                                        <tr key={round.roundNumber} className="border-b border-slate-800/50">
                                            <td className="p-3 text-slate-500 font-mono">{round.roundNumber}</td>
                                            {match.players.map(p => {
                                                const s = round.scores.find(score => score.playerName === p.name);
                                                return <td key={p.name} className="p-3 font-mono text-lg">{s?.pointsAdded || 0}</td>
                                            })}
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <IconButton icon={<Edit2 size={14} />} title="Editar Puntaje" variant="info" onClick={() => onEdit(round.roundNumber)} />
                                                    <IconButton icon={<Trash2 size={14} />} title="Eliminar Puntaje" variant="danger" onClick={() => onDelete(round.roundNumber)} />
                                                </div>
                                            </td>
                                        </tr>
                                    )).reverse()}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};