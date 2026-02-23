import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = ({ players }) => {
    // Sort players by points in descending order
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

    return (
        <div className="w-64 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 p-4 border-b border-white/10 flex items-center gap-3">
                <Trophy size={18} className="text-yellow-500" />
                <h2 className="text-xs font-black italic tracking-[0.2em] text-white">LEADERBOARD</h2>
            </div>

            <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                {sortedPlayers.map((player, index) => {
                    const isTop3 = index < 3;
                    const colors = [
                        'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
                        'text-gray-300 border-gray-400/30 bg-gray-400/5',
                        'text-orange-400 border-orange-500/30 bg-orange-500/5'
                    ];

                    return (
                        <motion.div
                            key={player.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isTop3 ? colors[index] : 'border-white/5 bg-white/5 text-gray-400'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black w-4 ${isTop3 ? 'text-white' : 'text-gray-600'}`}>
                                    #{index + 1}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold tracking-tight text-white truncate w-24">
                                        {player.name}
                                    </span>
                                    {isTop3 && (
                                        <div className="flex items-center gap-1 opacity-60">
                                            <Medal size={8} />
                                            <span className="text-[8px] uppercase font-black">Elite</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black italic text-cyan-400">
                                    {player.points}
                                </span>
                                <span className="text-[7px] uppercase font-bold tracking-widest opacity-40">PTS</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;
