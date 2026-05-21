import { Minus, Plus, Check, Ghost } from 'lucide-react';
import { IRoundScore, IRoundDetails } from '@el-porotero/shared';
import { IconButton, Button, Input } from '@/components';

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
    const muerto = score.details?.tomoMuerto || false;
    const canClose = (puras + impuras) > 0;

    return (
        <div className="score-input-stack">
            {/* INPUT DE PUNTOS DE FICHAS */}
            <Input
                type="text"
                inputMode="numeric"
                placeholder="Suma de fichas..."
                className="score-input-field flex-1"
                value={score.pointsAdded || ""}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    onUpdate({ pointsAdded: parseInt(val) || 0 });
                }}
            />

            {/* CONTADORES DE CANASTAS */}
            <div className="counter-grid-burako">
                {/* Puras */}
                <div className="counter-item-box">
                    <span className="counter-label">Puras</span>
                    <div className="counter-display-area">
                        <IconButton
                            icon={<Minus size={14} />}
                            title="Quitar Pura"
                            onClick={() => onUpdate({ canastasPuras: Math.max(0, puras - 1) })}
                            className='p-2.5!'
                        />
                        <span className="counter-number primary">{puras}</span>
                        <IconButton
                            icon={<Plus size={14} />}
                            variant="primary"
                            title="Sumar Pura"
                            onClick={() => onUpdate({ canastasPuras: puras + 1 })}
                            className='p-2.5!'
                        />
                    </div>
                </div>

                {/* Impuras */}
                <div className="counter-item-box">
                    <span className="counter-label">Impuras</span>
                    <div className="counter-display-area">
                        <IconButton
                            icon={<Minus size={14} />}
                            title="Quitar Impura"
                            onClick={() => onUpdate({ canastasImpuras: Math.max(0, impuras - 1) })}
                            className='p-2.5!'
                        />
                        <span className="counter-number main">{impuras}</span>
                        <IconButton
                            icon={<Plus size={14} />}
                            title="Sumar Impura"
                            onClick={() => onUpdate({ canastasImpuras: impuras + 1 })}
                            className='p-2.5!'
                        />
                    </div>
                </div>
            </div>

            {!isTeamGame && (
                <div className="score-input-row">
                    <Button
                        variant={cerro ? 'success' : 'ghost'}
                        disabled={disableExclusives && !cerro || !canClose}
                        className="btn-action-burako"
                        onClick={() => onUpdate({ isCerrar: !cerro })}
                    >
                        <Check size={14} /> CERRÓ
                    </Button>
                    <Button
                        variant={muerto ? 'primary' : 'danger'}
                        className="btn-action-burako"
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