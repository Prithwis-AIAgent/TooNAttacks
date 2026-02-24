import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, User } from 'lucide-react';

const WelcomeScreen = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length >= 2) {
            onNameSubmit(name.trim());
        } else {
            alert("Please enter a valid nickname (min 2 characters)");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#050510] overflow-hidden p-4 relative">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[48px] shadow-2xl relative z-10 text-center"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                    <Sword size={48} className="text-black" />
                </div>

                <div className="mb-10">
                    <h1 className="text-5xl font-black italic tracking-tighter text-white mb-3">
                        TOON <span className="text-cyan-400">ATTACKS</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em] opacity-60">
                        Battle for Card Supremacy
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="YOUR NICKNAME"
                            value={name}
                            onChange={(e) => setName(e.target.value.toUpperCase())}
                            autoFocus
                            className="w-full bg-black/40 border-2 border-white/5 rounded-3xl px-16 py-6 text-white text-xl font-black italic tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white hover:bg-cyan-50 text-black font-black italic text-xl py-6 rounded-3xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <span>ENTER ARENA</span>
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Sword size={24} className="group-hover:rotate-45 transition-transform" />
                        </motion.div>
                    </button>
                </form>

                <p className="mt-10 text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em] opacity-40">
                    Supabase & Socket.io Powered
                </p>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;
