import React, { useRef, useEffect, useState } from 'react';
import { Skin } from '../../types';
import SpinnerItemCard from './SpinnerItemCard';
import { SPINNER_DURATION_MS } from './Spinner';

interface SpinnerReelProps {
    items: Skin[];
    winner: Skin | null;
    winnerIndex?: number;
    isFinished: boolean;
    isPlaceholder?: boolean;
    onAnimationComplete: () => void;
    animationDelay: number;
}

const SpinnerReel: React.FC<SpinnerReelProps> = ({ items, winner, winnerIndex, isFinished, isPlaceholder = false, onAnimationComplete, animationDelay }) => {
    const reelTrackRef = useRef<HTMLDivElement>(null);
    const [itemWidth, setItemWidth] = useState(216);
    const [targetTransform, setTargetTransform] = useState<string | null>(null);

    // Measure the item width once the real items are rendered
    useEffect(() => {
        if (!isPlaceholder && reelTrackRef.current && reelTrackRef.current.firstChild) {
            const firstItem = reelTrackRef.current.firstChild as HTMLElement;
            const style = window.getComputedStyle(firstItem);
            const width = firstItem.offsetWidth;
            const marginLeft = parseFloat(style.marginLeft);
            const marginRight = parseFloat(style.marginRight);
            const totalWidth = width + marginLeft + marginRight;
            if (totalWidth > 0) {
                setItemWidth(totalWidth);
            }
        }
    }, [isPlaceholder, items]);

    // Set the target transform to trigger the animation
    useEffect(() => {
        if (isPlaceholder || typeof winnerIndex === 'undefined' || itemWidth === 0) {
            setTargetTransform(null); // Reset if we go back to placeholder
            return;
        }

        const ITEM_WIDTH_WITH_MARGIN = itemWidth;
        const ITEM_WIDTH_HALF = ITEM_WIDTH_WITH_MARGIN / 2;
        
        const perfectFinalPosition = -((winnerIndex * ITEM_WIDTH_WITH_MARGIN) + ITEM_WIDTH_HALF);
        const jitter = (Math.random() - 0.5) * (ITEM_WIDTH_WITH_MARGIN * 0.1);
        const finalPosition = perfectFinalPosition + jitter;

        // Using a timeout to ensure the initial state is rendered before the transition starts
        const timer = setTimeout(() => {
            setTargetTransform(`translateX(${finalPosition}px)`);
        }, 50); // Small delay to ensure browser renders initial state

        return () => clearTimeout(timer);

    }, [winnerIndex, isPlaceholder, itemWidth]);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        // Ensure we only fire for the transform property
        if (e.propertyName === 'transform') {
            onAnimationComplete();
        }
    };

    const initialTransform = `translateX(-${itemWidth / 2}px)`;

    const transitionStyle: React.CSSProperties = {
        transform: targetTransform || initialTransform,
        transitionProperty: 'transform',
        transitionDuration: targetTransform ? `${SPINNER_DURATION_MS}ms` : '0ms',
        transitionTimingFunction: targetTransform ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'ease',
        transitionDelay: targetTransform ? `${animationDelay}ms` : '0ms'
    };
    
    return (
        <div className={`relative w-full h-56 overflow-hidden spin-reel ${isFinished ? 'finished' : ''} ${isPlaceholder ? 'opacity-50' : ''}`}>
             <div 
                ref={reelTrackRef} 
                className="reel-track" 
                style={transitionStyle}
                onTransitionEnd={handleTransitionEnd}
            >
                {items.map((item, index) => {
                    const isTheWinningItem = isFinished && winner !== null && winnerIndex === index;
                    return (
                        <SpinnerItemCard 
                            key={`${item.id}-${index}-${item.instance_id || ''}`} 
                            skin={item} 
                            isWinner={isTheWinningItem}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default SpinnerReel;