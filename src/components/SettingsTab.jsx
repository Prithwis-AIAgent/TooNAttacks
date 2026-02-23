import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Hand, ShieldAlert, Zap } from 'lucide-react';

const SettingsTab = () => {
    const rules = [
        {
            icon: BookOpen,
            title: "The Objective",
            description: "Win all the cards from your opponents. The game ends when one player holds the entire deck."
        },
        {
            icon: Zap,
            title: "Gameplay Flow",
            description: "Each player starts with an equal stack of cards. The current turn holder chooses a stat (e.g., Strength, Intelligence) from their top card."
        },
        {
            icon: Hand,
            title: "Winning a Round",
            description: "The player with the highest value in the chosen stat wins the round and collects all competing cards into their stack."
        },
        {
            icon: ShieldAlert,
            title: "Tie Rule",
            description: "In case of a tie, the cards are returned to the bottom of each player's stack, and the turn remains with the same player."
        }
    ];

    return (
        <div className="p-12 max-w-5xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">
                    GAME <span className="text-cyan-400">SETTINGS</span>
                </h1>
                <p className="text-gray-500 text-sm tracking-wide">
                    Configure your experience and learn the laws of the Arena.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rules Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-black text-white italic mb-6 border-b border-white/10 pb-2">
                        GAME RULES
                    </h2>
                    <div className="space-y-4">
                        {rules.map((rule, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-4"
                            >
                                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 h-fit">
                                    <rule.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">{rule.title}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {rule.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Additional Settings Placeholder */}
                <section className="space-y-6">
                    <h2 className="text-xl font-black text-white italic mb-6 border-b border-white/10 pb-2">
                        PREFERENCES
                    </h2>
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Zap size={24} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            More settings coming soon
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsTab;
