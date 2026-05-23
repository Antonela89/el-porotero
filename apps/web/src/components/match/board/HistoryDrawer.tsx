import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X, Megaphone, ChevronDown } from 'lucide-react';
import { IMatch, IRound } from '@el-porotero/shared';
import { IconButton } from '@/components';
import { getShortName, sumTeamRound, getTeamStyle } from '@/utils';

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
    const [expandedRound, setExpandedRound] = useState<number | null>(null);

    const styleA = getTeamStyle('A');
    const styleB = getTeamStyle('B');

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
                                <thead>
                                    <tr>
                                        <th className="w-10">#</th>
                                        {match.isTeamGame ? (
                                            <>
                                                <th className={styleA.text}>EQ. A</th>
                                                <th className={styleB.text}>EQ. B</th>
                                            </>
                                        ) : (
                                            match.players.map(p => (
                                                <th key={p.name}>
                                                    <div className="history-player-header">
                                                        <span className="initials-pill">
                                                            {getShortName(p.name, allNames)}
                                                        </span>
                                                    </div>
                                                </th>
                                            )))}
                                        <th className="w-18"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...match.rounds].reverse().map((round: IRound) => (
                                        <Fragment key={round.roundNumber}>
                                            <tr className={expandedRound === round.roundNumber ? 'bg-white/2' : ''}>
                                                <td className="round-index" onClick={() => setExpandedRound(expandedRound === round.roundNumber ? null : round.roundNumber)}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        {round.roundNumber}
                                                        {match.gameType === 'Barsiga' && <ChevronDown size={10} className="opacity-80" />}
                                                    </div>
                                                </td>

                                                {match.isTeamGame ? (
                                                    <>
                                                        <td className={`round-points ${styleA.text} opacity-80`}>
                                                            {sumTeamRound(round, match.players, 'A')}
                                                        </td>
                                                        <td className={`round-points ${styleB.text} opacity-80`}>
                                                            {sumTeamRound(round, match.players, 'B')}
                                                        </td>
                                                    </>
                                                ) : (
                                                    round.scores.map(s => <td key={s.playerName} className="round-points">{s.pointsAdded}</td>)
                                                )}

                                                <td className="round-actions-cell">
                                                    <div className="round-actions">
                                                        <IconButton title='Editar' variant='info' icon={<Edit2 size={12} />} className="btn-edit-inline" onClick={() => onEdit(round.roundNumber)} />
                                                        <IconButton title='Eliminar' variant='danger' icon={<Trash2 size={12} />} className="btn-delete-inline" onClick={() => onDelete(round.roundNumber)} />
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* DETALLE DE CANTOS (Solo para Bársiga o si hay info extra) */}
                                            {expandedRound === round.roundNumber && match.gameType === 'Barsiga' && (
                                                <tr>
                                                    <td colSpan={4} className="pb-1 border-b border-white/5">
                                                        <div className="canto-detail-box animate-fade-in">
                                                            <div className="flex items-center  gap-2 my-2 opacity-50">
                                                                <Megaphone size={12} />
                                                                <span className="text-[9px] font-black uppercase">Desglose de Cantos</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {round.scores.map(s => (
                                                                    <div key={s.playerName} className="flex justify-between border-l border-white/10 pl-2">
                                                                        <span className="text-[10px] font-bold text-text-muted">{s.playerName}</span>
                                                                        <span className="text-[10px] font-black text-primary">+{s.details.cantos || 0} pts</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>

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