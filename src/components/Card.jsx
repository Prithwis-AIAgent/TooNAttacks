import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFaceUp = true, onStatClick, disabled, size = 'md' }) => {
    const name = card?.name || '???';
    const stats = card?.stats || {};
    const id = card?.id;

    const sizeStyles = {
        sm: 'w-[100px] h-[145px]',
        md: 'w-[200px] h-[290px]',
        lg: 'w-[240px] h-[350px]'
    };

    if (!card && !isFaceUp) {
        return (
            <motion.div
                className={`${sizeStyles[size]} rounded-lg bg-[#1e40af] border-2 border-white shadow-xl flex items-center justify-center overflow-hidden relative p-0.5`}
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
            className={`relative ${sizeStyles[size]} bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col p-[4px] border border-gray-300`}
        >
            {/* Main Blue Inner Frame */}
            <div className="flex-1 bg-[#2b3a8c] rounded-md border-[2px] border-[#2b3a8c] flex flex-col overflow-hidden relative">

                {/* Header with Doraemon Logo style */}
                <div className="flex justify-between items-center px-1.5 py-0.5 bg-white">
                    <div className="w-5 h-5 flex flex-col items-center justify-center bg-yellow-400 rounded-sm border border-black/20">
                        <span className="text-[7px] font-black leading-none">♠</span>
                        <span className="text-[9px] font-black leading-none">{id || '0'}</span>
                    </div>
                    <div className="flex items-baseline scale-90 origin-right">
                        <span className="text-blue-600 font-black italic text-sm leading-none tracking-tight">Dora</span>
                        <span className="text-red-500 font-black italic text-sm leading-none tracking-tight">emon</span>
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
                <div className="h-7 mx-0.5 mb-0.5 relative flex items-center justify-center px-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 skew-x-[-15deg] border-y border-orange-400 shadow-md" />
                    <h2 className="relative z-10 text-white font-black text-xs italic tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        {name.toUpperCase()}
                    </h2>
                </div>

                {/* Stats Table Section */}
                <div className="bg-[#bcebfe] m-0.5 rounded-sm p-0.5 flex flex-col gap-0.5 border border-black/10">
                    {/* ID / Row 1 */}
                    <div className="flex justify-between items-center text-[7px] font-black border-b border-blue-400/30 px-1 py-0.5">
                        <span className="text-blue-800">No.: {id < 10 ? `0${id}` : id}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-blue-900">★ STRENGTH</span>
                            <span className="text-black bg-white px-1 ml-2 min-w-[20px] text-center border border-black/10">{stats.strength || 0}</span>
                        </div>
                    </div>

                    {/* Row 2: Height / Weight */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="bg-yellow-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900">HEIGHT</span>
                            <span className="text-[7px] font-black text-black">{stats.height_ft || 0}' ★</span>
                        </div>
                        <div className="bg-yellow-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900">WEIGHT</span>
                            <span className="text-[7px] font-black text-black">{stats.weight_kg || 0} Kg</span>
                        </div>
                    </div>

                    {/* Row 3: IQ / Speed */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="bg-orange-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900 leading-none">INT'ENCE: IQ</span>
                            <span className="text-[7px] font-black text-black">{stats.intelligence_iq || 0}</span>
                        </div>
                        <div className="bg-orange-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900">SPEED</span>
                            <span className="text-[7px] font-black text-black">{stats.speed_hp || 0} HP</span>
                        </div>
                    </div>

                    {/* Row 4: Gadgets / Power */}
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="bg-green-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900">GADGETS</span>
                            <span className="text-[7px] font-black text-black">{stats.gadgets || 0}</span>
                        </div>
                        <div className="bg-green-300/60 p-0.5 flex justify-between items-center">
                            <span className="text-[6px] font-black text-blue-900">POWER</span>
                            <span className="text-[7px] font-black text-black">{stats.power || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Card;
