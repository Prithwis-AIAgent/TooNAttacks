import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, User, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Leaderboard = ({ players = [] }) => {
    const [globalScores, setGlobalScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobal = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('name, points')
                .order('points', { ascending: false })
                .limit(10);

            if (!error && data) {
                setGlobalScores(data);
            }
            setLoading(false);
        };
        fetchGlobal();
    }, []);

    const displayPlayers = globalScores.length > 0 ? globalScores : [...players].sort((a, b) => b.points - a.points);

    return (
        <div className="w-72 bg-black/60 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe size={18} className="text-cyan-400" />
                    <h2 className="text-[10px] font-black italic text-white tracking-[0.2em] uppercase">Global Rank</h2>
                </div>
            </div>

            <div className="p-3 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="py-10 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : displayPlayers.map((player, index) => {
                    const isTop3 = index < 3;
                    const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];

                    return (
                        <motion.div
                            key={player.name}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${index === 0 ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-white/5 border-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-black italic w-4 ${isTop3 ? rankColors[index] : 'text-gray-600'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-xs font-black italic text-white uppercase tracking-tight truncate w-24">
                                        {player.name}
                                    </p>
                                    <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                                        {isTop3 ? 'Master Pilot' : 'Rookie'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-black italic text-cyan-400 leading-none">{player.points || 0}</p>
                                <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">Pts</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;
