import { MesaPointsSelector, IconButton, Button, BurakoPlayerInput, TrucoInputRow } from "@/components";
import { Minus, Plus } from 'lucide-react';
import { IPlayer, IMatch, IRoundDetails,  IRoundScore, TrucoFlowState } from "@el-porotero/shared";

interface TeamInputGroupProps {
    teamId: 'A' | 'B';
    players: IPlayer[];
    match: IMatch;
    scores: IRoundScore[];
    handleTeamUpdate: (teamId: string, payload: Partial<IRoundDetails>) => void;
    isEditMode: boolean;
    sombreroIndex: number;
    updateScore: (index: number, payload: Partial<IRoundScore & IRoundDetails>) => void;
    updateScoreWithExclusivity: (index: number, payload: Partial<IRoundDetails>) => void;
    flowState: TrucoFlowState;
    onFlowChange: (newFlow: Partial<TrucoFlowState>) => void;
    anyoneClosed: boolean;

}

export const TeamInputGroup = ({ teamId, players, match, scores, handleTeamUpdate, updateScore, updateScoreWithExclusivity, ...props }: TeamInputGroupProps) => {
    const firstPlayerIdx = match.players.indexOf(players[0]);
    const teamDetails = scores[firstPlayerIdx]?.details;
    const game = match.gameType;

    return (
        <section className={`score-group-card team-${teamId.toLowerCase()}`}>
            <h3 className="score-group-title">Equipo {teamId}</h3>

            <div className="team-scoring-area">
                {/* Lógica de Burako */}
                {game === 'Burako' && (
                    <div className="flex flex-col gap-3">
                        <BurakoPlayerInput
                            score={scores[firstPlayerIdx]}
                            onUpdate={(val) => updateScore(firstPlayerIdx, val)}
                            isTeamGame={true} />
                        <div className="flex gap-2">
                            <Button variant={teamDetails?.isCerrar ? 'success' : 'ghost'} className="flex-1" onClick={() => handleTeamUpdate(teamId, { isCerrar: !teamDetails?.isCerrar })}>CERRÓ</Button>
                            <Button variant={teamDetails?.tomoMuerto ? 'primary' : 'danger'} className="flex-1" onClick={() => handleTeamUpdate(teamId, { tomoMuerto: !teamDetails?.tomoMuerto })}>MUERTO</Button>
                        </div>
                    </div>
                )}

                {game === 'Truco' && (
                    /* Aquí el Truco por equipos solo usa un input (del primer jugador del bando) */
                    <TrucoInputRow
                        match={match}
                        teamId={teamId}
                        score={scores[firstPlayerIdx]}
                        onUpdate={(val) => updateScore(firstPlayerIdx, val)}
                        flowState={props.flowState}
                        onFlowChange={props.onFlowChange}
                    />
                )}

                {/* Lógica de Escoba / Barsiga */}
                {['Escoba', 'Barsiga'].includes(game) && (
                    <div className="flex flex-col gap-3">
                        <MesaPointsSelector
                            details={teamDetails}
                            onToggle={(key) => updateScoreWithExclusivity(firstPlayerIdx, { [key]: !teamDetails?.[key as keyof IRoundDetails] })}
                        />
                        <div className="team-escoba-row">
                            <span className="label-mini">Escobas</span>
                            <div className="counter-control">
                                <IconButton title="Restar" icon={<Minus size={14} />} onClick={() => handleTeamUpdate(teamId, { escobas: Math.max(0, (teamDetails?.escobas || 0) - 1) })} />
                                <span className="counter-val">{teamDetails.escobas}</span>
                                <IconButton title="Sumar" variant="primary" icon={<Plus size={14} />} onClick={() => handleTeamUpdate(teamId, { escobas: (teamDetails?.escobas || 0) + 1 })} />
                            </div>
                        </div>
                        {game === 'Barsiga' && (
                            <div className="individual-cantos-grid">
                                {players.map((p: IPlayer) => (
                                    <div key={p.name} className="canto-input-box">
                                        <span className="text-[10px] font-bold">{p.name}</span>
                                        <input type="number" className="compact-input-v2" value={scores[match.players.indexOf(p)].details.cantos || 0} onChange={(e) => updateScore(match.players.indexOf(p), { cantos: Number(e.target.value) })} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};