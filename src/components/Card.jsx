import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFaceUp = true, onStatClick, disabled, size = 'md' }) => {
    const name = card?.name || '???';
    const stats = card?.stats || {};
    const id = card?.id;

    const sizeStyles = {
        sm: 'w-[140px] h-[200px]',
        md: 'w-[280px] h-[400px]',
        lg: 'w-[320px] h-[460px]'
    };

    if (!card && !isFaceUp) {
        return (
            <motion.div
                className={`${sizeStyles[size]} rounded-xl bg-[#1e40af] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden relative p-1`}
            >
                <div className="w-full h-full bg-[#1e3a8a] rounded-lg border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    <img src="/doraemon_cards/Back.jpg" alt="Card Back" className="w-full h-full object-cover" />
                </div>
            </motion.div>
        );
    }

    // Map stats to the visual layout names
    const statMapping = [
        { key: 'strength', label: 'STRENGTH' },
        { key: 'height_ft', label: 'HEIGHT', suffix: '\'' },
        { key: 'weight_kg', label: 'WEIGHT', suffix: ' kg' },
        { key: 'intelligence_iq', label: 'INT\'ENCE: IQ' },
        { key: 'speed_hp', label: 'SPEED', suffix: ' HP' },
        { key: 'gadgets', label: 'GADGETS' },
        { key: 'power', label: 'POWER' }
    ];

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative ${sizeStyles[size]} bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col p-[6px] border border-gray-300`}
        >
            {/* Main Blue Inner Frame */}
            <div className="flex-1 bg-[#2b3a8c] rounded-lg border-[3px] border-[#2b3a8c] flex flex-col overflow-hidden relative">

                {/* Header with Doraemon Logo style */}
                <div className="flex justify-between items-center px-2 py-1 bg-white">
                    <div className="w-8 h-8 flex flex-col items-center justify-center bg-yellow-400 rounded-sm border border-black/20">
                        <span className="text-[10px] font-black leading-none">♠</span>
                        <span className="text-xs font-black leading-none">{id || '0'}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-blue-600 font-black italic text-base leading-none tracking-tight">Dora</span>
                        <span className="text-red-500 font-black italic text-base leading-none tracking-tight">emon</span>
                    </div>
                </div>

                {/* Picture Area */}
                <div className="flex-1 bg-white m-1 rounded-sm overflow-hidden relative border border-gray-200">
                    <img
                        src={`/doraemon_cards/${id}.jpg`}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (!e.target.src.endsWith('.png')) {
                                e.target.src = `/doraemon_cards/${id}.png`;
                            } else {
                                e.target.src = "/doraemon_cards/front.jpg";
                                e.target.className = "w-full h-full object-cover grayscale opacity-20";
                            }
                        }}
                    />
                </div>

                {/* Name Bar (Retro Banner style) */}
                <div className="h-10 mx-1 mb-1 relative flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 skew-x-[-15deg] border-y-2 border-orange-400 shadow-lg" />
                    <h2 className="relative z-10 text-white font-black text-lg italic tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                        {name.toUpperCase()}
                    </h2>
                </div>

                {/* Stats Table Section */}
                <div className="bg-[#bcebfe] m-1 rounded-sm p-1 flex flex-col gap-0.5 border border-black/10">
                    {/* ID / Row 1 */}
                    <div className="flex justify-between items-center text-[10px] font-black border-b border-blue-400/30 px-1 py-0.5">
                        <span className="text-blue-800">No.: {id < 10 ? `0${id}` : id}</span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => !disabled && onStatClick?.('strength')}
                                className={`flex items-center gap-1 group/stat cursor-pointer hover:bg-white/40 px-1 rounded transition-colors ${disabled ? 'opacity-80' : ''}`}
                            >
                                <span className="text-blue-900 group-hover/stat:text-blue-600">★ STRENGTH</span>
                                <span className="text-black bg-white px-1 ml-4 min-w-[30px] text-center border border-black/10">{stats.strength || 0}</span>
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Height / Weight */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <button
                            onClick={() => !disabled && onStatClick?.('height_ft')}
                            className="bg-yellow-300/60 p-1 flex justify-between items-center group/stat hover:bg-yellow-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900">HEIGHT</span>
                            <span className="text-[10px] font-black text-black">{stats.height_ft || 0}' ★</span>
                        </button>
                        <button
                            onClick={() => !disabled && onStatClick?.('weight_kg')}
                            className="bg-yellow-300/60 p-1 flex justify-between items-center group/stat hover:bg-yellow-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900">WEIGHT</span>
                            <span className="text-[10px] font-black text-black">{stats.weight_kg || 0} Kg</span>
                        </button>
                    </div>

                    {/* Row 3: IQ / Speed */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <button
                            onClick={() => !disabled && onStatClick?.('intelligence_iq')}
                            className="bg-orange-300/60 p-1 flex justify-between items-center group/stat hover:bg-orange-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900 leading-none">INT'ENCE: IQ</span>
                            <span className="text-[10px] font-black text-black">{stats.intelligence_iq || 0}</span>
                        </button>
                        <button
                            onClick={() => !disabled && onStatClick?.('speed_hp')}
                            className="bg-orange-300/60 p-1 flex justify-between items-center group/stat hover:bg-orange-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900">SPEED</span>
                            <span className="text-[10px] font-black text-black">{stats.speed_hp || 0} HP</span>
                        </button>
                    </div>

                    {/* Row 4: Gadgets / Power */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <button
                            onClick={() => !disabled && onStatClick?.('gadgets')}
                            className="bg-green-300/60 p-1 flex justify-between items-center group/stat hover:bg-green-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900">GADGETS</span>
                            <span className="text-[10px] font-black text-black">{stats.gadgets || 0}</span>
                        </button>
                        <button
                            onClick={() => !disabled && onStatClick?.('power')}
                            className="bg-green-300/60 p-1 flex justify-between items-center group/stat hover:bg-green-300 transition-colors"
                        >
                            <span className="text-[8px] font-black text-blue-900">POWER</span>
                            <span className="text-[10px] font-black text-black">{stats.power || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Card;
