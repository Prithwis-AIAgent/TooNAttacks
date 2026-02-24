import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

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
        <div className="h-screen w-full flex items-center justify-center overflow-hidden relative font-['Prompt']">
            {/* Full-screen Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: 'url("/assets/splash.jpg")' }}
            />

            {/* Overlay for better readability if needed, but keeping it light to show artwork */}
            <div className="absolute inset-0 bg-black/10 z-[1]" />

            <div className="relative z-10 w-full max-w-lg mt-32 md:mt-48">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* The "Enter Arena" Area Overlay */}
                    <div className="w-full bg-black/40 backdrop-blur-md border border-white/20 p-8 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60 mb-2">Identify Yourself</h2>
                                <p className="text-xl font-black text-white tracking-tight">WHO IS ENTERING THE ARENA?</p>
                            </div>

                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter Nickname..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value.toUpperCase())}
                                    autoFocus
                                    className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-16 py-5 text-white text-lg font-black tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-600 uppercase"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white font-black italic text-2xl py-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-95 border-b-8 border-orange-700 active:border-b-0 uppercase tracking-tighter"
                            >
                                Enter Arena
                            </button>
                        </form>
                    </div>

                    <p className="text-[10px] text-white font-bold uppercase tracking-[0.5em] opacity-40 drop-shadow-md">
                        2026 EDITION • SUPABASE POWERED
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
