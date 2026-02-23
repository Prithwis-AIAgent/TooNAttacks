import React from 'react';
import { motion } from 'framer-motion';

const PlayerAvatar = ({ player, isTurn, position }) => {
    const isBottom = position === 'bottom';

    return (
        <div className={`flex flex-col items-center gap-2 ${isBottom ? 'scale-110' : 'scale-90 opacity-80'}`}>
            <motion.div
                animate={isTurn ? { scale: [1, 1.1, 1], boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-16 h-16 rounded-full border-2 ${isTurn ? 'border-cyan-400 bg-cyan-900/30' : 'border-white/20 bg-white/5'} flex items-center justify-center overflow-hidden backdrop-blur-sm`}
            >
                <span className="text-2xl font-bold text-white/50">{player.name[0]}</span>
            </motion.div>

            <div className="text-center">
                <p className="text-xs font-bold text-white tracking-widest uppercase">{player.name}</p>
                <div className="flex gap-2 justify-center mt-1">
                    <span className="text-[10px] text-cyan-400 font-mono">{player.points} PTS</span>
                    <span className="text-[10px] text-gray-400 font-mono">[{player.cardCount}]</span>
                </div>
            </div>
        </div>
    );
};

export default PlayerAvatar;
