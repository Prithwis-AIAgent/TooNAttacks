```
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

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
        <div className="h-screen w-full flex items-center justify-center overflow-hidden relative font-['Prompt'] bg-[#050510]">
            {/* Full-screen Background Image */}
            <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: 'url("/assets/splash.jpg")' }}
            />
            
            {/* Elegant Gradient Overlays for integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/40 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/20 via-transparent to-transparent z-[1]" />
            
            {/* Mask to specifically hide the bottom "Enter Arena" part of the original image */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050510] to-transparent z-[2]" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    {/* Floating Sparkles for extra 'smooth' feel */}
                    <motion.div
                        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="mb-6"
                    >
                        <Sparkles className="text-cyan-400 w-8 h-8 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </motion.div>

                    <div className="w-full glass-morphism border border-white/10 p-10 rounded-[48px] shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        {/* Inner subtle glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px]" />
                        
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="text-center mb-8">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/80 mb-3">Login to Arena</h2>
                                <h3 className="text-2xl font-black text-white leading-tight tracking-tight">WHICH CHAMPION ARE <br/> YOU TODAY?</h3>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-md opacity-0 group-focus-within:opacity-20 transition-opacity" />
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors z-20" size={20} />
                                <input
                                    type="text"
                                    placeholder="ENTER NICKNAME..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value.toUpperCase())}
                                    autoFocus
                                    className="w-full bg-black/60 border-2 border-white/5 rounded-2xl px-16 py-6 text-white text-xl font-black tracking-[0.2em] focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-gray-700 uppercase relative z-10"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden rounded-2xl transition-all active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-[length:200%_100%] group-hover:bg-[100%_0] transition-all duration-700" />
                                <div className="relative py-6 px-4 flex items-center justify-center gap-3">
                                    <span className="text-white font-black italic text-2xl uppercase tracking-tighter drop-shadow-md">Enter Arena</span>
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Sparkles size={20} className="text-white opacity-80" />
                                    </motion.div>
                                </div>
                                {/* Bottom shadow factor for depth */}
                                <div className="h-2 w-full bg-orange-700/80 absolute bottom-0" />
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-[9px] text-white/30 font-bold uppercase tracking-[0.6em] drop-shadow-lg">
                        Est. 2026 • TooNAttacks Online
                    </p>
                </motion.div>
            </div>

            <style jsx>{`
    .glass - morphism {
    background: rgba(10, 10, 26, 0.45);
    backdrop - filter: blur(25px);
    -webkit - backdrop - filter: blur(25px);
}
`}</style>
        </div>
    );
};

export default WelcomeScreen;
```
