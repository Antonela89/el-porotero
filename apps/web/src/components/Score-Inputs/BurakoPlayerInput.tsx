import { Minus, Plus, Check, Ghost } from 'lucide-react';
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { IconButton, Button } from '@/components';

interface BurakoPlayerInputProps {
    score: IRoundScore;
    onUpdate: (update: Partial<IRoundScore> & Partial<IRoundDetails>) => void;
    isTeamGame: boolean;
    disableExclusives?: boolean;
}

export const BurakoPlayerInput = ({
    score,
    onUpdate,
    isTeamGame,
    disableExclusives = false
}: BurakoPlayerInputProps) => {

    const puras = score.details?.canastasPuras || 0;
    const impuras = score.details?.canastasImpuras || 0;
    const cerro = score.details?.isCerrar || false;
    const muerto = score.details?.tomoMuerto ?? true;
    const canClose = (puras + impuras) > 0;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* INPUT DE PUNTOS DE FICHAS */}
            <div className="flex flex-col gap-1">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Suma de fichas..."
                    className="form-input bg-background border border-white/10 py-3 text-center rounded-xl outline-none focus:border-primary w-full transition-all font-display text-lg"
                    value={score.pointsAdded || ""}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        onUpdate({ pointsAdded: parseInt(val) || 0 });
                    }}
                />
            </div>

            {/* CONTADORES DE CANASTAS */}
            <div className="grid grid-cols-2 gap-3">
                {/* Puras */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-text-muted font-bold uppercase text-center">Puras</span>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <IconButton
                            icon={<Minus size={14} />}
                            title="Quitar Pura"
                            onClick={() => onUpdate({ canastasPuras: Math.max(0, puras - 1) })}
                        />
                        <span className="font-display text-primary font-bold text-xl">{puras}</span>
                        <IconButton
                            icon={<Plus size={14} />}
                            variant="primary"
                            title="Sumar Pura"
                            onClick={() => onUpdate({ canastasPuras: puras + 1 })}
                        />
                    </div>
                </div>

                {/* Impuras */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-text-muted font-bold uppercase text-center">Impuras</span>
                    <div className="flex items-center justify-between bg-background rounded-xl p-1 border border-white/5">
                        <IconButton
                            icon={<Minus size={14} />}
                            title="Quitar Impura"
                            onClick={() => onUpdate({ canastasImpuras: Math.max(0, impuras - 1) })}
                        />
                        <span className="font-display text-text-main font-bold text-xl">{impuras}</span>
                        <IconButton
                            icon={<Plus size={14} />}
                            title="Sumar Impura"
                            onClick={() => onUpdate({ canastasImpuras: impuras + 1 })}
                        />
                    </div>
                </div>
            </div>

            {/* ACCIONES DE CIERRE (Solo Individual) */}
            {!isTeamGame && (
                <div className="flex gap-2">
                    <Button
                        variant={cerro ? 'success' : 'ghost'}
                        disabled={disableExclusives && !cerro || !canClose}
                        className="flex-1 !text-[10px] !py-3"
                        onClick={() => onUpdate({ isCerrar: !cerro })}
                    >
                        <Check size={14} /> CERRÓ
                    </Button>

                    <Button
                        variant={muerto ? 'primary' : 'danger'}
                        className="flex-1 !text-[10px] !py-3"
                        onClick={() => onUpdate({ tomoMuerto: !muerto })}
                    >
                        {muerto ? <Check size={14} /> : <Ghost size={14} />}
                        {muerto ? 'MUERTO' : 'SIN MUERTO'}
                    </Button>
                </div>
            )}
        </div>
    );
};