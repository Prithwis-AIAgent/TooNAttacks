import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const Header = ({ equippedDeck }) => {
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
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Info size={18} />
                </button>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold tracking-widest text-gray-300">SERVER ONLINE</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
