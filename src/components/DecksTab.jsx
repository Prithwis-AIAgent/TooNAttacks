import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Users, Flame } from 'lucide-react';

const decks = [
    {
        id: 'doraemon',
        title: 'Doraemon Classic',
        description: 'The iconic childhood characters. Well-balanced stats for beginners.',
        count: 52,
        difficulty: 'Easy',
        rating: 4.8,
        locked: false,
        color: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-cyan-500/30'
    }
];

const DecksTab = ({ equippedDeck, onEquip }) => {
    return (
        <div className="p-12 max-w-7xl mx-auto overflow-visible">
            <header className="mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">
                    CARD <span className="text-cyan-400">COLLECTION</span>
                </h1>
                <p className="text-gray-500 text-sm tracking-wide max-w-xl">
                    Choose your arsenal. Each deck features unique character types and stat distributions.
                    Equip a deck to enter the matching arenas.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {decks.map((deck) => {
                    const isEquipped = equippedDeck?.id === deck.id;

                    return (
                        <motion.div
                            key={deck.id}
                            whileHover={!deck.locked ? { y: -10 } : {}}
                            onClick={() => !deck.locked && onEquip(deck)}
                            className={`relative overflow-hidden group rounded-3xl border-2 transition-all duration-500 ${deck.borderColor
                                } ${deck.locked ? 'opacity-60 grayscale' : 'cursor-pointer'} ${isEquipped ? 'ring-4 ring-cyan-400/50 scale-[1.02]' : ''}`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${deck.color} opacity-40 group-hover:opacity-60 transition-opacity`} />

                            {/* Deck Image Preview */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="/doraemon_cards/front.jpg"
                                    alt={deck.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] to-transparent opacity-60" />
                            </div>

                            {/* Frosted Glass Overlay */}
                            <div className="relative z-10 p-8 flex flex-col h-full bg-black/40 backdrop-blur-sm">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl bg-black/40 border ${deck.borderColor}`}>
                                        {deck.locked ? <Lock size={20} className="text-gray-500" /> : <Users size={20} className="text-cyan-400" />}
                                    </div>
                                    {isEquipped && (
                                        <div className="bg-cyan-500 text-black px-3 py-1 rounded-full text-[10px] font-black tracking-widest animate-pulse">
                                            EQUIPPED
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-bold text-white">{deck.rating}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-black italic tracking-tight mb-3 text-white">
                                    {deck.title.toUpperCase()}
                                </h3>
                                <p className="text-xs text-gray-400 leading-relaxed mb-8">
                                    {deck.description}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mt-auto mb-8">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Cards</p>
                                        <p className="text-xl font-bold font-mono text-white">{deck.count}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Difficulty</p>
                                        <p className="text-xs font-bold text-gray-300">{deck.difficulty}</p>
                                    </div>
                                </div>

                                {/* Interaction Visual */}
                                <div className={`w-full py-4 rounded-2xl font-black tracking-[0.2em] text-xs transition-all text-center ${isEquipped
                                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                    : deck.locked
                                        ? 'bg-white/5 text-gray-600 border border-white/5'
                                        : 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                    }`}
                                >
                                    {isEquipped ? 'EQUIPPED' : deck.locked ? 'COMING SOON' : 'EQUIP DECK'}
                                </div>
                            </div>

                            {/* Locked Blur FX */}
                            {deck.locked && (
                                <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[2px] z-20 pointer-events-none" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DecksTab;
