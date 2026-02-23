import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFaceUp = true, onStatClick, disabled, deckId, size = 'md' }) => {
    const name = card?.name || '???';
    const stats = card?.stats || {};
    const id = card?.id;
    const isDoraemon = deckId === 'doraemon' || true;

    const sizeStyles = {
        sm: 'w-24 h-36',
        md: 'w-48 h-72',
        lg: 'w-56 h-80'
    };

    if (!card && !isFaceUp) {
        // Hidden card (back)
        return (
            <motion.div
                className={`${sizeStyles[size]} rounded-3xl bg-indigo-950 border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden relative`}
            >
                {isDoraemon ? (
                    <img src="/doraemon_cards/Back.jpg" alt="Card Back" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="text-white/10 font-black text-6xl">?</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={!disabled && isFaceUp ? { y: -5, scale: 1.02 } : {}}
            className={`relative ${sizeStyles[size]} rounded-3xl overflow-hidden border-4 transition-all duration-500 shadow-2xl flex flex-col ${isFaceUp
                ? 'bg-black/80 border-cyan-500/30'
                : 'bg-indigo-950 border-white/10'
                }`}
        >
            {/* Card Content Area */}
            <div className={`p-4 bg-white/5 border-b border-white/10 flex flex-col ${size === 'sm' ? 'hidden' : ''}`}>
                <h3 className="text-[10px] font-black italic text-cyan-400 tracking-widest uppercase truncate">{name}</h3>
                <div className="h-0.5 w-12 bg-cyan-500 rounded-full mt-1" />
            </div>

            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#151525]">
                {isDoraemon && (
                    <img
                        src={`/doraemon_cards/${id}.jpg`}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            if (!e.target.src.endsWith('.png')) {
                                e.target.src = `/doraemon_cards/${id}.png`;
                            } else {
                                e.target.src = "/doraemon_cards/front.jpg";
                                e.target.className = "absolute inset-0 w-full h-full object-cover opacity-50";
                            }
                        }}
                    />
                )}

                {!isDoraemon && (
                    <div className="text-4xl font-bold text-white/5 select-none">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Card Stats */}
            <div className={`p-2 space-y-1 bg-black/40 ${size === 'sm' ? 'px-1' : 'px-4'}`}>
                {Object.entries(stats).map(([statName, statValue]) => (
                    <button
                        key={statName}
                        disabled={disabled || !isFaceUp}
                        onClick={() => onStatClick && onStatClick(statName)}
                        className={`flex items-center justify-between transition-all w-full px-2 rounded-xl group/stat ${size === 'sm' ? 'py-0.5' : 'py-2'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500/20 active:scale-95'
                            }`}
                    >
                        {size !== 'sm' && (
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest group-hover/stat:text-cyan-400 transition-colors">
                                {statName.replace('_', ' ')}
                            </span>
                        )}
                        <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} font-black text-white group-hover/stat:text-cyan-300`}>
                            {statValue}
                        </span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default Card;
