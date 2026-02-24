import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

const MusicController = ({ isArenaActive }) => {
    const [isMusicOn, setIsMusicOn] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.1; // Reduced to 10% volume as requested
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isArenaActive && isMusicOn) {
            audio.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
            audio.pause();
        }
    }, [isArenaActive, isMusicOn]);

    const toggleMusic = () => {
        const newState = !isMusicOn;
        setIsMusicOn(newState);

        if (newState && isArenaActive) {
            audioRef.current?.play().catch(e => console.log("Playback failed:", e));
        } else {
            audioRef.current?.pause();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <audio
                ref={audioRef}
                src="/audio/bg-music.mp3"
                loop
                preload="auto"
            />

            <button
                onClick={toggleMusic}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 backdrop-blur-xl shadow-2xl cursor-pointer group ${isMusicOn
                        ? 'bg-[var(--accent-blue)]/20 border-[var(--accent-blue)]/50 text-[var(--accent-blue)] shadow-[0_0_20px_rgba(0,209,255,0.2)]'
                        : 'bg-black/60 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
            >
                <div className="relative">
                    <Music size={20} className={isMusicOn ? 'animate-bounce' : ''} />
                    {isMusicOn && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-ping" />
                    )}
                </div>

                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black uppercase tracking-widest mb-0.5">
                        BGM
                    </span>
                    <span className="text-[12px] font-black italic tracking-tighter">
                        {isMusicOn ? 'ACTIVE' : 'MUTED'}
                    </span>
                </div>

                {isMusicOn && (
                    <div className="flex gap-0.5 ml-2">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="w-1 h-3 bg-[var(--accent-blue)] rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                )}
            </button>
        </div>
    );
};

export default MusicController;
