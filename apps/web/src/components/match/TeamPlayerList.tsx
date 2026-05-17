import { Crown, Megaphone } from 'lucide-react';
import { getShortName } from '@/utils';
import { IconButton } from '@/components';
import { motion } from 'framer-motion';

const MotionArticle = motion.create('article');

interface Player {
    name: string; isDealer: boolean
};

interface TeamPlayerListProps {
    allNames: string[];
    players: Player[];
    showCantar?: boolean;
    onCantar?: (name: string) => void;
}

export const TeamPlayerList = ({ players, allNames, showCantar, onCantar }: TeamPlayerListProps) => (
    <MotionArticle className="team-players-row">
        {players.map((p: Player) => (
            <div key={p.name} className="player-slot">
                {/* Burbuja de Iniciales */}
                <div className={`player-initials-circle ${p.isDealer ? 'is-dealer' : ''}`}>
                    {getShortName(p.name, allNames)}

                    {/* Coronita flotante si es dealer */}
                    {p.isDealer && (
                        <div className="dealer-crown-abs">
                            <Crown size={12} fill="currentColor" className='text-primary'/>
                        </div>
                    )}
                </div>

                {/* Botón Cantar debajo de la inicial */}
                {showCantar && onCantar && (
                    <IconButton
                        icon={<Megaphone size={14} />}
                        onClick={() => onCantar(p.name)}
                        title={`Cantar punto de ${p.name}`}
                        className='btn-cantar-pill'
                    />
                )}
            </div>
        ))}
    </MotionArticle>
);