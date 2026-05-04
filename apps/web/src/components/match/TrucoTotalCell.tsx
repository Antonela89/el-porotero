interface TrucoStatus {
    label: string;
    val: number;
}

interface TrucoTotalCellProps {
    total: number;
    status: TrucoStatus;
}

export const TrucoTotalCell = ({ total, status }: TrucoTotalCellProps) => {
    const isBuenas = status.label === 'Buenas';
    return (
        <td className="score-total-cell">
            <div className="truco-status-stack">
                {/* La etiqueta (Malas/Buenas) */}
                <span className={`truco-stage-label ${isBuenas ? 'is-buenas' : ''}`}>
                    {status.label}
                </span>

                {/* El valor (1 al 15) */}
                <span className={`truco-score-value ${isBuenas ? 'is-buenas' : ''}`}>
                    {status.val}
                </span>

                {/* El total histórico para referencia */}
                <span className="score-meta-text">
                    {total} PTS TOTALES
                </span>
            </div>
        </td>
    );
};