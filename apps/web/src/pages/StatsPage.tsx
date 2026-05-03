// apps/web/src/pages/StatsPage.tsx
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { motion } from 'framer-motion';
import { Trophy, Target, Hash, Flame } from 'lucide-react';
import { IUserStats, IGameStat } from '@el-porotero/shared';

export const StatsPage = () => {
    const [stats, setStats] = useState<IUserStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await api.get<IUserStats>('/stats');
            setStats(data);
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-10 text-center animate-pulse text-primary">Analizando tus timbas...</div>;

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
                <p className="text-text-muted text-sm">Historial acumulado de tus juegos</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface p-5 rounded-4xl border border-white/5 flex flex-col gap-3"
                    >
                        <div className={`${card.color} opacity-80`}>{card.icon}</div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-text-muted tracking-widest">{card.label}</p>
                            <p className="text-2xl font-display font-bold text-text-main">{card.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Gráfico simple de barras hecho con CSS */}
            <section className="bg-surface p-6 rounded-[2.5rem] border border-white/5">
                <h3 className="text-xs font-black uppercase text-text-muted mb-6 tracking-widest">Partidas por Juego</h3>
                <div className="flex flex-col gap-4">
                    {stats.gameHistory.map((gh: IGameStat) => (
                        <div key={gh._id} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold px-1">
                                <span>{gh._id}</span>
                                <span className="text-primary">{gh.count}</span>
                            </div>
                            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(gh.count / stats.totalPlayed) * 100}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};