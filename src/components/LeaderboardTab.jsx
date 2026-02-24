import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, User, Zap, Star, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LeaderboardTab = () => {
    const [globalScores, setGlobalScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGlobal = async () => {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('player_name, score, created_at')
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Aggregate scores locally
                const aggregated = data.reduce((acc, curr) => {
                    if (!acc[curr.player_name]) {
                        acc[curr.player_name] = {
                            player_name: curr.player_name,
                            score: 0,
                            last_active: curr.created_at
                        };
                    }
                    acc[curr.player_name].score += curr.score;
                    return acc;
                }, {});

                // Convert to array and sort
                const sorted = Object.values(aggregated).sort((a, b) => b.score - a.score);
                setGlobalScores(sorted.slice(0, 20));
            }
            setLoading(false);
        };
        fetchGlobal();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="text-yellow-400" size={24} />;
        if (index === 1) return <Shield className="text-gray-300" size={22} />;
        if (index === 2) return <Zap className="text-orange-400" size={20} />;
        return <span className="text-gray-600 font-black italic">{index + 1}</span>;
    };

    return (
        <div className="p-12 max-w-7xl mx-auto h-full flex flex-col">
            <header className="mb-12 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="text-cyan-400" size={32} />
                        <h1 className="text-4xl font-black italic tracking-tighter">
                            GLOBAL <span className="text-cyan-400">LEADERBOARD</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm tracking-wide max-w-xl uppercase font-bold tracking-[0.2em]">
                        The Hall of Toon Legends
                    </p>
                </div>
            </header>

            <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                <div className="grid grid-cols-[80px_1fr_150px_150px] p-8 border-b border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                    <span>Rank</span>
                    <span>Player Name</span>
                    <span>Score</span>
                    <span>Date</span>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        globalScores.map((player, index) => (
                            <motion.div
                                key={player.player_name + index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-[80px_1fr_150px_150px] items-center p-6 rounded-3xl border transition-all ${index < 3 ? 'bg-cyan-500/5 border-cyan-500/20 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-center">{getRankIcon(index)}</div>

                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-black ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-400' : 'bg-cyan-500/20 text-cyan-400'
                                        }`}>
                                        {player.player_name[0]}
                                    </div>
                                    <span className="text-lg font-black italic text-white uppercase tracking-tight">
                                        {player.player_name}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-2xl font-black italic text-cyan-400 leading-none">
                                        {player.score}
                                    </span>
                                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Battle Points</span>
                                </div>

                                <div className="text-gray-500 font-mono text-xs">
                                    {new Date(player.created_at).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardTab;
