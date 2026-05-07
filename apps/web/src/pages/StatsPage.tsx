import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Trophy, Target, Hash, Flame } from 'lucide-react';
import { useStats } from '@/hooks';

const MotionDiv = motion.create('div');

export const StatsPage = () => {
    const { data: stats, isLoading } = useStats();

    if (isLoading) {
        return (
            <div className="stats-skeleton-wrapper">
                <div className="skeleton-header" />
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-stat-card" />)}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        { label: 'Partidas', val: stats.totalPlayed, icon: <Hash />, color: 'blue' },
        { label: 'Victorias', val: stats.won, icon: <Trophy />, color: 'emerald' },
        { label: 'Efectividad', val: `${stats.winRate}%`, icon: <Target />, color: 'primary' },
        { label: 'Favorito', val: stats.favoriteGame, icon: <Flame />, color: 'orange' },
    ];

    return (
        <>
            <Helmet>
                <title>El Porotero | Mis Partidas</title>
                <meta name="description" content="Gestioná tus partidas de Truco, Loba y Bársiga en tiempo real." />
                <meta property="og:title" content="El Porotero Online" />
                <meta property="og:description" content="El anotador profesional para timbiar con amigos." />
                <meta property="og:image" content="/og-image.jpg" /> {/* Imagen 1200x630px en public/ */}
            </Helmet>

            <div className="stats-page-container">
                <header className="stats-header">
                    <h1 className="stats-title">Mi Rendimiento</h1>
                    <p className="stats-subtitle">Historial acumulado de tus juegos</p>
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
                            <div className={`stat-icon-wrapper ${card.color}`}>
                                {card.icon}
                            </div>
                            <div className="stat-info-group">
                                <p className="stat-label-caps">{card.label}</p>
                                <p className="stat-value">{card.val}</p>
                            </div>
                        </MotionDiv>
                    ))}
                </section>

                <section className="chart-panel">
                    <h3 className="stat-label-caps mb-6">Partidas por Juego</h3>
                    <div className="chart-list">
                        {stats.gameHistory.map((gh) => (
                            <div key={gh._id} className="chart-row">
                                <div className="chart-label-row">
                                    <span className="chart-label-game">{gh._id}</span>
                                    <span className="chart-label-count">{gh.count}</span>
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
        </>
    );
};