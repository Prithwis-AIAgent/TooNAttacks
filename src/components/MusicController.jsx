import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const MusicController = ({ isArenaActive }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isArenaActive && !isMuted) {
            audioRef.current?.play().catch(e => console.log("Autoplay prevented:", e));
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    }, [isArenaActive]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play().catch(e => console.log("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3">
            <audio
                ref={audioRef}
                src="/audio/bg-music.mp3"
                loop
                preload="auto"
            />

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl transition-all hover:border-[var(--accent-blue)]/50 group">
                {isPlaying && (
                    <div className="flex gap-0.5 px-2">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="w-1 h-3 bg-[var(--accent-blue)] rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                )}

                <button
                    onClick={toggleMute}
                    className="p-2 text-gray-400 hover:text-[var(--accent-blue)] transition-colors rounded-xl hover:bg-white/5 cursor-pointer"
                    title={isMuted ? "Unmute Music" : "Mute Music"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
        </div>
    );
};

export default MusicController;
