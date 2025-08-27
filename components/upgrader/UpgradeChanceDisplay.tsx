import React, { useEffect, useState, useMemo } from 'react';

interface UpgradeDialProps {
    chance: number;
    isUpgrading: boolean;
    result: 'win' | 'loss' | null;
}

const SPINNER_DURATION_MS = 5000;

const UpgradeChanceDisplay: React.FC<UpgradeDialProps> = ({ chance, isUpgrading, result }) => {
    const [wheelRotation, setWheelRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResultText, setShowResultText] = useState(false);

    const winAngle = useMemo(() => (Math.max(0, Math.min(chance, 100)) / 100) * 360, [chance]);

    useEffect(() => {
        let resultTimer: ReturnType<typeof setTimeout>;

        if (isUpgrading && result) {
            setIsSpinning(true);
            setShowResultText(false);

            let targetAngleToStopAtTop = 0;
            if (result === 'win') {
                // Pick a random spot within the win zone to land on.
                // e.g., from 10% to 90% of the arc to avoid landing on edges.
                targetAngleToStopAtTop = winAngle * (0.1 + Math.random() * 0.8);
            } else {
                // Pick a random spot within the lose zone.
                const loseZoneSize = 360 - winAngle;
                targetAngleToStopAtTop = winAngle + loseZoneSize * (0.1 + Math.random() * 0.8);
            }

            // Calculate a new absolute rotation that is guaranteed to be higher than the current one
            // This prevents spinning backward visually and makes spins cumulative.
            const newBaseRotations = (Math.ceil(wheelRotation / 360) + 4 + Math.floor(Math.random() * 2)) * 360;
            const finalRotation = newBaseRotations - targetAngleToStopAtTop;

            // Use rAF to ensure the initial state is set before transitioning
            requestAnimationFrame(() => {
                setWheelRotation(finalRotation);
            });

            resultTimer = setTimeout(() => {
                setShowResultText(true);
            }, SPINNER_DURATION_MS);

        } else if (!isUpgrading && !result) {
            // Reset state for the next round, but DO NOT reset wheel rotation to prevent flicker.
            setIsSpinning(false);
            setShowResultText(false);
        }

        return () => {
            clearTimeout(resultTimer);
        };
    }, [isUpgrading, result, winAngle]);

    // SVG path for the win chance arc
    const largeArcFlag = winAngle > 180 ? 1 : 0;
    const endX = 60 + 50 * Math.cos(Math.PI * (winAngle - 90) / 180);
    const endY = 60 + 50 * Math.sin(Math.PI * (winAngle - 90) / 180);
    const arcPath = `M 60 10 A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    const wheelTransition = isSpinning
        ? `transform ${SPINNER_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        : 'none';

    let statusConfig = {
        arcColor: 'stroke-blue-500',
        displayText: `${chance.toFixed(2)}%`,
        textColor: 'text-white',
        subText: 'Upgrade chance',
        pulseClass: '',
        markerColor: 'fill-slate-300',
    };
    
    if (showResultText && result) {
        if (result === 'win') {
            statusConfig = {
                ...statusConfig,
                arcColor: 'stroke-green-400',
                displayText: 'WIN!',
                textColor: 'text-green-400',
                pulseClass: 'animate-pulse-win',
                subText: '',
                markerColor: 'fill-green-400',
            };
        } else { // loss
            statusConfig = {
                ...statusConfig,
                arcColor: 'stroke-red-500',
                displayText: 'LOSE',
                textColor: 'text-red-500',
                subText: '',
                markerColor: 'fill-red-500',
            };
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center w-64 h-64 scale-125">
             {/* Static Marker */}
            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 z-20 transition-colors duration-300`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" className={statusConfig.markerColor}>
                    <path d="M2 2 L22 2 L12 22 Z" />
                </svg>
            </div>

            <div className={`relative w-full h-full ${statusConfig.pulseClass}`}>
                {/* Rotating Dial */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: wheelTransition,
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 120 120">
                        <defs>
                            <radialGradient id="dialBg" cx="50%" cy="50%" r="50%">
                                <stop offset="85%" stopColor="#12233f" />
                                <stop offset="100%" stopColor="#0d1a2f" />
                            </radialGradient>
                        </defs>
                        <circle cx="60" cy="60" r="59" fill="url(#dialBg)" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#0d1a2f" strokeWidth="18" />
                        <circle cx="60" cy="60" r="58" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                        
                        {/* Win Chance Arc */}
                        {chance > 0 && (
                            <path d={arcPath} strokeWidth="8" strokeLinecap="round" fill="none" className={`${statusConfig.arcColor} transition-colors duration-300`} />
                        )}
                    </svg>
                </div>
                
                {/* Static Center Text */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none z-10">
                    <span className={`text-5xl font-bold transition-colors duration-300 ${statusConfig.textColor}`}>{statusConfig.displayText}</span>
                    <span className="text-sm text-gray-500 mt-1">{statusConfig.subText}</span>
                </div>
            </div>
        </div>
    );
};

export default UpgradeChanceDisplay;