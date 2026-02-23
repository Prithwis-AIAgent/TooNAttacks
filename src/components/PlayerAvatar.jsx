import React from 'react';
import { motion } from 'framer-motion';

const PlayerAvatar = ({ player, isTurn, size = 'md' }) => {
    const isLarge = size === 'lg';

    return (
        <div className={`flex flex-col items-center gap-2 ${isLarge ? 'scale-110' : 'scale-90 opacity-80'}`}>
            <motion.div
                animate={isTurn ? { scale: [1, 1.1, 1], boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`${isLarge ? 'w-20 h-20' : 'w-16 h-16'} rounded-full border-2 ${isTurn ? 'border-cyan-400 bg-cyan-900/30' : 'border-white/20 bg-white/5'} flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-xl`}
            >
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative">
                    <span className="text-2xl font-black text-white italic drop-shadow-lg">{player.name[0]}</span>
                    {isTurn && (
                        <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
                    )}
                </div>
            </motion.div>

            <div className="text-center group">
                <p className="text-xs font-black text-white tracking-widest uppercase italic group-hover:text-cyan-400 transition-colors">
                    {player.name}
                </p>
                <div className="flex gap-2 justify-center mt-1">
                    <span className="text-[10px] text-cyan-400 font-black tracking-tighter bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20 shadow-lg">
                        {player.points || 0} PTS
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {player.cardCount || 0} CRDS
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlayerAvatar;
