import { motion } from 'framer-motion';
import { Trophy, Target, Hash, Flame } from 'lucide-react';
import { useStats } from '@/hooks';

const MotionDiv = motion.create('div');

export const StatsPage = () => {
    const { data: stats, isLoading } = useStats();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-20 w-48 bg-surface rounded-2xl" />
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface rounded-4xl" />)}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        { label: 'Partidas', val: stats.totalPlayed, icon: <Hash />, color: 'text-blue-400' },
        { label: 'Victorias', val: stats.won, icon: <Trophy />, color: 'text-emerald-400' },
        { label: 'Efectividad', val: `${stats.winRate}%`, icon: <Target />, color: 'text-primary' },
        { label: 'Favorito', val: stats.favoriteGame, icon: <Flame />, color: 'text-orange-400' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-text-main">Mi Rendimiento</h1>
                <p className="text-text-muted text-sm italic">Historial acumulado de tus juegos</p>
            </header>

            <section className="stats-grid">
                {cards.map((card, i) => (
                    <MotionDiv
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="stat-card"
                    >
                        <div className={`${card.color} opacity-80`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="stat-label-caps">{card.label}</p>
                            <p className="text-2xl font-display font-bold text-text-main">{card.val}</p>
                        </div>
                    </MotionDiv>
                ))}
            </section>

            {/* Gráfico de barras semántico */}
            <section className="chart-panel">
                <h3 className="stat-label-caps mb-6">Partidas por Juego</h3>
                <div className="flex flex-col gap-5">
                    {stats.gameHistory.map((gh) => (
                        <div key={gh._id} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-bold px-1">
                                <span className="text-text-main">{gh._id}</span>
                                <span className="text-primary">{gh.count}</span>
                            </div>
                            <div className="progress-track">
                                <MotionDiv
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(gh.count / stats.totalPlayed) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="progress-fill"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};