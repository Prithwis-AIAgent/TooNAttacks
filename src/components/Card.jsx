import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFaceUp = true, onStatClick, disabled, size = 'md' }) => {
    const name = card?.name || '???';
    const stats = card?.stats || {};
    const id = card?.id;

    const sizeStyles = {
        sm: 'w-[110px] h-[160px]',
        md: 'w-[220px] h-[320px]',
        lg: 'w-[260px] h-[380px]'
    };

    if (!card && !isFaceUp) {
        return (
            <motion.div
                className={`${sizeStyles[size]} rounded-lg bg-[#1e40af] border-2 border-white shadow-xl flex items-center justify-center overflow-hidden relative p-1`}
            >
                <div className="w-full h-full bg-[#1e3a8a] rounded border border-white/20 flex items-center justify-center overflow-hidden">
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
            className={`relative ${sizeStyles[size]} bg-white rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col p-[5px] border border-gray-300`}
        >
            {/* Main Blue Inner Frame */}
            <div className="flex-1 bg-[#2b3a8c] rounded-md border-[2px] border-[#2b3a8c] flex flex-col overflow-hidden relative">

                {/* Header with Doraemon Logo style */}
                <div className="flex justify-between items-center px-2 py-1 bg-white">
                    <div className="w-6 h-6 flex flex-col items-center justify-center bg-yellow-400 rounded-sm border border-black/20">
                        <span className="text-[8px] font-black leading-none">♠</span>
                        <span className="text-[11px] font-black leading-none">{id || '0'}</span>
                    </div>
                    <div className="flex items-baseline scale-100 origin-right">
                        <span className="text-blue-600 font-black italic text-base leading-none tracking-tight">Dora</span>
                        <span className="text-red-500 font-black italic text-base leading-none tracking-tight">emon</span>
                    </div>
                </div>

                {/* Picture Area */}
                <div className="flex-1 bg-white m-0.5 rounded-sm overflow-hidden relative border border-gray-200">
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
                <div className="h-8 mx-0.5 mb-0.5 relative flex items-center justify-center px-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 skew-x-[-15deg] border-y border-orange-400 shadow-md" />
                    <h2 className="relative z-10 text-white font-black text-sm italic tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        {name.toUpperCase()}
                    </h2>
                </div>

                {/* Stats Table Section */}
                <div className="bg-[#bcebfe] m-0.5 rounded-sm p-1 flex flex-col gap-0.5 border border-black/10">
                    {/* Row 1: No. and Strength */}
                    <div className="grid grid-cols-[1fr_auto_1.5fr] items-center text-[10px] font-black border-b border-blue-400/30 px-1 py-1">
                        <span className="text-blue-800">No.: {id < 10 ? `0${id}` : id}</span>
                        <span className="text-yellow-500 mx-1.5">★</span>
                        <div className="flex justify-between items-center flex-1">
                            <span className="text-blue-900">STRENGTH</span>
                            <span className="text-black ml-1 text-xs">{stats.strength || 0}</span>
                        </div>
                    </div>

                    {/* Row 2: Height and Weight */}
                    <div className="grid grid-cols-[1fr_auto_1.5fr] items-center text-[10px] font-black bg-yellow-300/60 px-1 py-1 border-b border-blue-400/30">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900">HEIGHT</span>
                            <span className="text-black text-xs">{stats.height_ft || 0}'</span>
                        </div>
                        <span className="text-yellow-500 mx-1.5">★</span>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900">WEIGHT</span>
                            <span className="text-black text-xs">{stats.weight_kg || 0} Kg</span>
                        </div>
                    </div>

                    {/* Row 3: IQ and Speed */}
                    <div className="grid grid-cols-[1fr_auto_1.5fr] items-center text-[10px] font-black bg-orange-300/60 px-1 py-1 border-b border-blue-400/30">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900 leading-none">IQ</span>
                            <span className="text-black ml-1 text-xs">{stats.intelligence_iq || 0}</span>
                        </div>
                        <span className="text-yellow-500 mx-1.5">★</span>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900">SPEED</span>
                            <span className="text-black text-xs">{stats.speed_hp || 0} HP</span>
                        </div>
                    </div>

                    {/* Row 4: Gadgets and Power */}
                    <div className="grid grid-cols-[1fr_auto_1.5fr] items-center text-[10px] font-black bg-green-300/60 px-1 py-1">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900">GADGETS</span>
                            <span className="text-black ml-1 text-xs">{stats.gadgets || 0}</span>
                        </div>
                        <span className="text-yellow-500 mx-1.5">★</span>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900">POWER</span>
                            <span className="text-black text-xs">{stats.power || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
            </div >
        </motion.div >
    );
};

export default Card;
