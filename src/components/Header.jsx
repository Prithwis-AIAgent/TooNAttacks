import React, { useState } from 'react';
import { ShieldCheck, Info, X, Star, Swords, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ equippedDeck }) => {
    const [showRules, setShowRules] = useState(false);

    const rules = [
        { icon: Star, title: "Objective", text: "Win the match by collecting all cards or having the most points when a player runs out." },
        { icon: Swords, title: "Battles", text: "Pick a stat on your turn. Higher value wins the round and takes all cards on the table." },
        { icon: Target, title: "Ties (Drawn Round)", text: "If stats are equal, cards stay on the board. The winner of the next round takes everything!" },
        { icon: Trophy, title: "Scoring", text: "Win a round to earn 5 points. Forfeit wins award 10 points. Climb the global rank!" },
    ];

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Current Status</h2>
                    <div className="flex items-center gap-2">
                        {equippedDeck ? (
                            <>
                                <ShieldCheck size={14} className="text-green-400" />
                                <span className="text-xs font-bold text-green-400 tracking-wider">
                                    {equippedDeck.title} EQUIPPED
                                </span>
                            </>
                        ) : (
                            <span className="text-xs font-bold text-red-500/60 tracking-wider animate-pulse">
                                NO DECK EQUIPPED
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="h-8 w-px bg-white/10" />
                <button
                    onClick={() => setShowRules(true)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                    <Info size={18} />
                </button>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold tracking-widest text-gray-300">SERVER ONLINE</span>
                </div>
            </div>

            {/* Rules Modal Overlay */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0a0a1a] border border-cyan-500/30 rounded-[40px] p-8 max-w-lg w-full relative shadow-[0_0_100px_rgba(6,182,212,0.1)]"
                        >
                            <button
                                onClick={() => setShowRules(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                                    <Swords className="text-cyan-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-black italic tracking-tighter text-white">
                                    GAME <span className="text-cyan-400">RULES</span>
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {rules.map((rule, i) => {
                                    const Icon = rule.icon;
                                    return (
                                        <div key={i} className="flex gap-4">
                                            <div className="mt-1">
                                                <Icon className="text-cyan-500/60" size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400/80 mb-1">
                                                    {rule.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    {rule.text}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setShowRules(false)}
                                className="w-full mt-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black italic rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                            >
                                GOT IT, LET'S PLAY!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
