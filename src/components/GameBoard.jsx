import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import PlayerAvatar from './PlayerAvatar';
import Leaderboard from './Leaderboard';
import { Trophy } from 'lucide-react';

const GameBoard = ({ gameState, currentPlayerName, socket, deckId }) => {
    const [battleResults, setBattleResults] = useState(null);
    const [isRevealing, setIsRevealing] = useState(false);
    const [stage, setStage] = useState('idle'); // idle, flying, revealed, awarding
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const players = gameState.players || [];
    const turnOf = gameState.turnOf;
    const isMyTurn = currentPlayerName === turnOf;

    // Relative positions
    const myIndex = players.findIndex(p => p.name === currentPlayerName);
    const reorderedPlayers = [
        ...players.slice(myIndex),
        ...players.slice(0, myIndex)
    ];
    const posMap = ['bottom', 'left', 'top', 'right'];
    const playersWithPos = reorderedPlayers.map((p, i) => ({ ...p, pos: posMap[i] }));

    useEffect(() => {
        if (!socket) return;

        socket.on('revealWinner', (results) => {
            setBattleResults(results);
            startAnimationSequence(results);
        });

        return () => socket.off('revealWinner');
    }, [socket]);

    const startAnimationSequence = async (results) => {
        setIsRevealing(true);
        setStage('flying');

        // 1. Cards fly to center (handled by motion layout)
        await new Promise(r => setTimeout(r, 800));

        // 2. Flip to reveal
        setStage('revealed');
        await new Promise(r => setTimeout(r, 2000));

        // 3. Move to winner
        setStage('awarding');
        await new Promise(r => setTimeout(r, 1000));

        // Reset
        setIsRevealing(false);
        setStage('idle');
        setBattleResults(null);
    };

    const handleStatSelect = (stat) => {
        if (isMyTurn && !isRevealing) {
            socket.emit('selectStat', { roomId: gameState.roomId, chosenStat: stat });
        }
    };

    // Animation variants for cards in the center
    const getCardVariants = (pos, winnerName) => {
        const positions = {
            bottom: { x: 0, y: 150 },
            left: { x: -200, y: 0 },
            top: { x: 0, y: -150 },
            right: { x: 200, y: 0 },
            center: { x: 0, y: 0, scale: 1.2 }
        };

        const winnerPos = playersWithPos.find(p => p.name === winnerName)?.pos;
        const winnerCoords = positions[winnerPos] || { x: 0, y: 0 };

        return {
            idle: positions[pos],
            flying: { x: 0, y: 0, transition: { type: 'spring', damping: 20 } },
            revealed: { rotateY: 0, scale: 1.3 },
            awarding: { ...winnerCoords, scale: 0, opacity: 0, transition: { duration: 0.6 } }
        };
    };

    return (
        <div className="relative w-full h-screen bg-[#050510] flex items-center justify-center overflow-hidden font-['Outfit']">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(31,38,135,0.15)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative w-full max-w-6xl aspect-video flex items-center justify-center">

                {/* PLAYER AVATARS IN CROSS LAYOUT */}
                {playersWithPos.map((p) => (
                    <div
                        key={p.name}
                        className={`absolute transition-all duration-500 ${p.pos === 'bottom' ? 'bottom-10' :
                            p.pos === 'top' ? 'top-10' :
                                p.pos === 'left' ? 'left-10' : 'right-10'
                            }`}
                    >
                        <PlayerAvatar player={p} isTurn={turnOf === p.name} position={p.pos} />
                    </div>
                ))}

                {/* BATTLE ARENA (Center) */}
                <div className="relative z-10">
                    <AnimatePresence>
                        {isRevealing && battleResults && (
                            <div className="flex gap-4">
                                {battleResults.results.map((res) => {
                                    const p = playersWithPos.find(pl => pl.name === res.playerName);
                                    if (!p) return null;

                                    return (
                                        <motion.div
                                            key={res.playerName}
                                            variants={getCardVariants(p.pos, battleResults.winnerName)}
                                            initial="flying"
                                            animate={stage}
                                            className="perspective-1000"
                                        >
                                            <Card
                                                card={{ name: res.cardName, stats: { [battleResults.stat]: res.value } }}
                                                isFaceUp={stage !== 'flying'}
                                                deckId={deckId}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Prompt for Turn Player */}
                    {!isRevealing && isMyTurn && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-40 left-1/2 -translate-x-1/2 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 px-6 py-2 rounded-full"
                        >
                            <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase animate-pulse">
                                Your Turn - Select a Stat
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* DECK VISUALS (Static cards at each player) */}
                {!isRevealing && playersWithPos.map(p => (
                    p.pos !== 'bottom' && (
                        <div key={`deck-${p.name}`} className={`absolute ${p.pos === 'top' ? 'top-32' : p.pos === 'left' ? 'left-32' : 'right-32'
                            }`}>
                            <div className="w-24 h-36 rounded-lg bg-indigo-900/40 border border-white/10 shadow-lg" />
                        </div>
                    )
                ))}

                {/* SELF CARD (Always visible at bottom) */}
                {!isRevealing && (
                    <div className="absolute bottom-32">
                        <Card
                            card={playersWithPos[0].topCard}
                            onStatClick={handleStatSelect}
                            disabled={!isMyTurn}
                            deckId={deckId}
                        />
                    </div>
                )}
            </div>

            {/* Leaderboard Overlay */}
            <div className="absolute top-8 right-8 z-50 flex flex-col items-end gap-4">
                <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className={`p-3 rounded-2xl border transition-all duration-300 backdrop-blur-md ${showLeaderboard
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Trophy size={20} />
                </button>

                <AnimatePresence>
                    {showLeaderboard && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        >
                            <Leaderboard players={players} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Winner Announcement Overlay */}
            <AnimatePresence>
                {stage === 'revealed' && battleResults && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-black/60 backdrop-blur-xl px-20 py-10 rounded-3xl border-2 border-cyan-400/30 shadow-[0_0_100px_rgba(34,211,238,0.2)] text-center">
                            <h2 className="text-gray-400 uppercase tracking-[0.5em] text-sm mb-2">Round Winner</h2>
                            <h1 className="text-6xl font-black text-white italic tracking-tighter">
                                {battleResults.winnerName.toUpperCase()}
                            </h1>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameBoard;
