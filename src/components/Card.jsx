import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Card = ({ card, isFaceUp = true, animationProps = {}, onStatClick, disabled, deckId = 'doraemon' }) => {
    const isDoraemon = deckId === 'doraemon';

    if (!card && !isFaceUp) {
        // Hidden card (back)
        return (
            <motion.div
                {...animationProps}
                className="w-40 h-60 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden relative"
            >
                {isDoraemon ? (
                    <img src="/doraemon-back.jpg" alt="Card Back" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
                        <div className="text-4xl font-bold text-white/10 select-none">TOON</div>
                    </>
                )}
            </motion.div>
        );
    }

    if (!card) return null;

    const { name, stats, id } = card;

    return (
        <motion.div
            {...animationProps}
            whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
            className={`w-40 h-60 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${disabled ? 'grayscale opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-cyan-500/20'
                }`}
        >
            {/* Card Header */}
            <div className="p-2 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 z-10">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 truncate">
                    {name}
                </h3>
            </div>

            {/* Card Content Area */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#151525]">
                {isDoraemon && (
                    <img
                        src={`/Doraemon Cards/${id}.jpg`}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/doraemon-front.jpg";
                            e.target.className = "absolute inset-0 w-full h-full object-cover opacity-50";
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
            <div className="p-1 px-2 space-y-1 bg-black/40">
                {Object.entries(stats).map(([stat, value]) => (
                    <div
                        key={stat}
                        onClick={() => !disabled && onStatClick?.(stat)}
                        className="flex justify-between items-center text-[9px] group hover:bg-white/5 p-1 rounded transition-colors"
                    >
                        <span className="text-gray-400 uppercase tracking-tighter group-hover:text-white transition-colors">
                            {stat.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-cyan-400">{value}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Card;
