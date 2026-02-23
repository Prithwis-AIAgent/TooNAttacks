import React from 'react';
import { LayoutGrid, Sword, Trophy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, isArenaLocked }) => {
    const menuItems = [
        { id: 'decks', icon: LayoutGrid, label: 'Decks', locked: false },
        { id: 'arena', icon: Sword, label: 'Arena', locked: isArenaLocked },
    ];

    return (
        <div className="w-20 bg-black/40 backdrop-blur-3xl border-r border-white/10 flex flex-col items-center py-8 z-50">
            {/* Logo */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <span className="font-black text-black italic text-xl">T</span>
            </div>

            {/* Navigation Icons */}
            <div className="flex-1 flex flex-col gap-8">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => !item.locked && setActiveTab(item.id)}
                            className={`relative group p-4 rounded-2xl transition-all duration-300 ${item.locked ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                                } ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-500'}`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label} {item.locked && '(Locked)'}
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full"
                                    style={{ top: '50%', translateY: '-50%' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Icons */}
            <div className="flex flex-col gap-6 text-gray-500">
                <button className="hover:text-white transition-colors">
                    <Trophy size={20} />
                </button>
                <button className="hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
