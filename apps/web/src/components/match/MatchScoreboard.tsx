import { useState, useEffect, useRef } from 'react';
import { History, ChevronUp } from 'lucide-react';
import { IMatch } from '@el-porotero/shared';
import { PlayerScoreCard, HistoryDrawer, TeamScoreCard } from '@/components';
import confetti from 'canvas-confetti';

interface MatchScoreboardProps {
    match: IMatch;
    onEditRound: (num: number) => void;
    onDeleteRound: (num: number) => void;
    onReengage: (name: string) => void;
    onCantar: (name: string) => void;
    onRematch: (match: IMatch) => void;
}

export const MatchScoreboard = ({ match, onEditRound, onDeleteRound, onReengage, onCantar, onRematch }: MatchScoreboardProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Usamos un Ref para no disparar el confeti múltiples veces si hay re-renders
    const hasCelebrated = useRef(false);

    useEffect(() => {
        // Disparamos solo si hay un ganador y no hemos celebrado todavía en esta sesión
        if (match.status === 'finished' && match.winner && !hasCelebrated.current) {

            const commonConfig = {
                origin: { y: 0.7 },
                zIndex: 9999,
                disableForReducedMotion: true
            };

            // Función de disparo prolija
            const fire = (particleRatio: number, opts: object) => {
                confetti({
                    ...commonConfig,
                    ...opts,
                    origin: { y: 0.7 },
                    particleCount: Math.floor(200 * particleRatio),
                    zIndex: 9999,
                    disableForReducedMotion: true 
                });
            };

            // Ráfaga de confeti (estilo fuegos artificiales)
            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });

            hasCelebrated.current = true;
        }

        // Si borramos una ronda y el estado vuelve a 'active', reseteamos el ref
        if (match.status === 'active') {
            hasCelebrated.current = false;
        }
    }, [match.status, match.winner]); // Reacciona al cambio de estado

    const isLoseOnLimit = ['Loba', 'Chinchon', 'Uno'].includes(match.gameType);
    const isWinnerOnLimit = ['Barsiga', 'Escoba', 'Burako', 'Truco'].includes(match.gameType);
    const isTeamLayout = match.isTeamGame || match.gameType === 'Truco';
    const isMosca = match.gameType === 'Mosca';

    const allPlayerNames = match.players.map(p => p.name)

    const sombreroIndex = (isMosca && match.players.length === 5)
        ? (match.currentDealerIndex + 1) % match.players.length : -1;

    const gridClassName = isTeamLayout
        ? "scoreboard-grid mode-teams"
        : "scoreboard-grid mode-individual";

    const getEffectiveWinner = () => {
        if (match.winner) return match.winner;

        // Fallback para equipos
        if (isTeamLayout) {
            const totalA = match.players.filter(p => p.team === 'A').reduce((acc, p) => acc + p.score, 0);
            const totalB = match.players.filter(p => p.team === 'B').reduce((acc, p) => acc + p.score, 0);
            if (totalA >= match.config.limitScore) return 'A';
            if (totalB >= match.config.limitScore) return 'B';
        }
        return null;
    };

    const currentWinner = getEffectiveWinner() ?? undefined;

    return (
        <>
            {/* SECCIÓN DE PUNTAJES (Cards) */}
            <div className={gridClassName}>
                {isTeamLayout ? (
                    // --- MODO EQUIPOS ---
                    ['A', 'B'].map(t => {
                        return (
                            <TeamScoreCard
                                key={t}
                                teamId={t as 'A' | 'B'}
                                match={match}
                                winner={currentWinner}
                                isWinnerOnLimit={isWinnerOnLimit}
                                onCantar={onCantar}
                                onRematch={onRematch}
                            />
                        );
                    })
                ) : (
                    // --- MODO INDIVIDUAL ---
                    match.players.map((p, i) => (
                        <PlayerScoreCard
                            key={p.name}
                            name={p.name}
                            score={p.score}
                            match={match}
                            winner={currentWinner}
                            isDealer={i === match.currentDealerIndex}
                            isSombrero={i === sombreroIndex}
                            isOut={p.isOut}
                            reengage={p.reengageCount}
                            isLoseOnLimit={isLoseOnLimit}
                            onReengage={() => onReengage(p.name)}
                            showCantar={match.gameType === 'Barsiga'}
                            onCantar={() => onCantar(p.name)}
                            onRematch={() => onRematch(match)}
                        />
                    ))
                )}
            </div>

            {/* ACCESO AL HISTORIAL (Activador del Drawer) */}
            {match.rounds.length > 0 && (
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="history-trigger"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg">
                            <History size={18} className="text-indigo-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-slate-200">Ver Rondas</span>
                            <span className="text-[10px] uppercase opacity-50">{match.rounds.length} registradas</span>
                        </div>
                    </div>
                    <ChevronUp size={20} />
                </button>
            )}

            {/* EL DRAWER (Se renderiza fuera del flujo normal pero se controla aquí) */}
            <HistoryDrawer
                isOpen={isHistoryOpen}
                allNames={allPlayerNames}
                onClose={() => setIsHistoryOpen(false)}
                match={match}
                onEdit={(num) => {
                    setIsHistoryOpen(false);
                    onEditRound(num);
                }}
                onDelete={onDeleteRound}
            />
        </>
    );
};