import { Crown, Megaphone } from 'lucide-react';
import { getShortName } from '@/utils';

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
    <div className="flex justify-center gap-4 mt-2 py-2 border-t border-white/5">
        {players.map((p: Player) => (
            <div key={p.name} className="flex flex-col items-center gap-1">
                {/* Burbuja de Iniciales */}
                <div className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${p.isDealer ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'}
                    border-2 ${p.isDealer ? 'border-amber-200' : 'border-transparent'}
                `}>
                    {getShortName(p.name, allNames)}
                    
                    {/* Coronita flotante si es dealer */}
                    {p.isDealer && (
                        <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5">
                            <Crown size={10} fill="currentColor" className="text-amber-400" />
                        </div>
                    )}
                </div>

                {/* Botón Cantar debajo de la inicial */}
                {showCantar && onCantar && (
                    <button
                        onClick={() => onCantar(p.name)}
                        className="p-1 rounded-full bg-slate-800 text-slate-400 active:bg-indigo-500 active:text-white transition-colors"
                    >
                        <Megaphone size={12} />
                    </button>
                )}
            </div>
        ))}
    </div>
);