import { Crown, Megaphone } from 'lucide-react';
import { getShortName } from '@/utils';
import { IconButton } from '@/components';
import { motion } from 'framer-motion';

const MotionArticle = motion.create('article');

interface Player {
    name: string; isDealer: boolean
};

interface TeamPlayerListProps {
    // teamId: 'A' | 'B';
    allNames: string[];
    players: Player[];
    // color: string;
    showCantar?: boolean;
    onCantar?: (name: string) => void;
}

// Este componente ahora vive dentro de la Card de equipo
export const TeamPlayerList = ({ players, allNames, showCantar, onCantar }: TeamPlayerListProps) => (
    <MotionArticle className="flex justify-center gap-4 py-2">
        {players.map((p: Player) => (
            <div key={p.name} className="flex flex-col items-center gap-1">
                {/* Burbuja de Iniciales */}
                <div className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-md
                    ${p.isDealer ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'}
                    border-2 ${p.isDealer ? 'border-amber-100' : 'border-transparent'}
                `}>
                    {getShortName(p.name, allNames)}

                    {/* Coronita flotante si es dealer */}
                    {p.isDealer && (
                        <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1">
                            <Crown size={12} fill="currentColor" className="text-amber-400" />
                        </div>
                    )}
                </div>

                {/* Botón Cantar debajo de la inicial */}
                {showCantar && onCantar && (
                    <IconButton
                        icon={<Megaphone size={14} />}
                        onClick={() => onCantar(p.name)}
                        title="Cantar puntos"
                        className='p-1.5 rounded-full bg-white/5 text-slate-400 active:bg-indigo-500 active:text-white transition-colors'
                    />
                )}
            </div>
        ))}
    </MotionArticle>
);