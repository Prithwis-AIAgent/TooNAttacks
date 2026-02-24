import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import PlayerAvatar from './PlayerAvatar';
import Leaderboard from './Leaderboard';
import { Trophy, RefreshCw, LogOut } from 'lucide-react';

const GameBoard = ({ gameState, currentPlayerName, socket, deckId }) => {
    const [battleResults, setBattleResults] = useState(null);
    const [stage, setStage] = useState('idle'); // idle, pending, revealed
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameOverData, setGameOverData] = useState(null);
    const [pendingShow, setPendingShow] = useState(null); // { playerName, stat, value, timeLeft }

    const players = gameState.players || [];
    const turnOf = gameState.turnOf;
    const isMyTurn = currentPlayerName === turnOf;
    const myPlayer = players.find(p => p.name === currentPlayerName);

    // Custom layout logic based on player count
    const getLayoutConfig = (playerCount) => {
        const myIndex = players.findIndex(p => p.name === currentPlayerName);
        const reordered = [...players.slice(myIndex), ...players.slice(0, myIndex)];

        const configs = {
            1: ['bottom'], // Should not happen in game
            2: ['left', 'right'],
            3: ['bottom', 'top-left', 'top-right'],
            4: ['bottom', 'left', 'top', 'right']
        };

        const roles = configs[playerCount] || configs[2];
        return reordered.map((p, i) => ({ ...p, role: roles[i] }));
    };

    const playersWithPos = getLayoutConfig(players.length);

    const handleStatSelect = (stat) => {
        if (!isMyTurn || stage !== 'idle') return;
        socket.emit('selectStat', { roomId: gameState.roomId, chosenStat: stat });
    };

    useEffect(() => {
        socket.on('statChosen', (data) => {
            setPendingShow({ ...data, timeLeft: 5 });
            setStage('pending');
        });

        socket.on('revealWinner', (results) => {
            setPendingShow(null);
            setBattleResults(results);
            setStage('revealed');

            setTimeout(() => {
                setBattleResults(null);
                setStage('idle');
            }, 6000);
        });

        socket.on('gameOver', (data) => {
            setGameState(prev => ({ ...prev, status: 'finished' }));
            setGameOverData(data);

            // Save local player score if match finished gracefully
            if (data.finalScores) {
                const me = data.finalScores.find(p => p.name === currentPlayerName);
                if (me && me.points > 0) {
                    supabase
                        .from('leaderboard')
                        .insert([{ player_name: me.name, score: me.points }])
                        .then(({ error }) => {
                            if (error) console.error("Score save error:", error.message);
                        });
                }
            }
        });

        socket.on('updateState', (state) => {
            if (state.status === 'finished') {
                // Game engine might report finished before socket event
            }
        });

        return () => {
            socket.off('revealWinner');
            socket.off('gameOver');
            socket.off('updateState');
        };
    }, [socket]);

    const handleForfeit = () => {
        if (window.confirm("Are you sure you want to forfeit the match?")) {
            onQuit();
        }
    };


    // UI Position Helpers
    const getRoleStyles = (role) => {
        const styles = {
            'bottom': { bottom: '2%', left: '50%', x: '-50%' },
            'top': { top: '5%', left: '50%', x: '-50%' },
            'left': { left: '12%', top: '50%', y: '-50%' },
            'right': { right: '12%', top: '50%', y: '-50%' },
            'top-left': { top: '8%', left: '15%' },
            'top-right': { top: '8%', right: '15%' }
        };
        return styles[role] || styles['bottom'];
    };

    const getBattleOffset = (role) => {
        const offsets = {
            'bottom': { x: 0, y: 150 },
            'top': { x: 0, y: -150 },
            'left': { x: -140, y: 0 },
            'right': { x: 140, y: 0 },
            'top-left': { x: -140, y: -140 },
            'top-right': { x: 140, y: -140 }
        };
        return offsets[role] || { x: 0, y: 0 };
    };

    // Stats Selection Box Layout - 4 on left, 4 on right to match card rows
    const leftStatButtons = [
        { id: 'id', label: 'NO.' },
        { id: 'height_ft', label: 'HGT' },
        { id: 'intelligence_iq', label: 'IQ' },
        { id: 'gadgets', label: 'GDG' }
    ];

    const rightStatButtons = [
        { id: 'strength', label: 'STR' },
        { id: 'weight_kg', label: 'WGT' },
        { id: 'speed_hp', label: 'SPD' },
        { id: 'power', label: 'PWR' }
    ];

    useEffect(() => {
        let timer;
        if (pendingShow && pendingShow.timeLeft > 0) {
            timer = setInterval(() => {
                setPendingShow(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [pendingShow]);

    const handleShowCard = () => {
        socket.emit('showCard', gameState.roomId);
    };

    if (gameOverData) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full flex flex-col items-center gap-8"
                >
                    <div className="text-center">
                        <Trophy size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
                        <h1 className="text-4xl font-black italic text-white tracking-widest mb-2">GAME OVER</h1>
                        <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm opacity-60">
                            {gameOverData.reason || "MATCH COMPLETED"}
                        </p>
                    </div>

                    <div className="w-full">
                        <Leaderboard players={gameOverData.finalScores || players} />
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black italic text-xl rounded-3xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95"
                    >
                        RETURN TO LOBBY
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_center,_#151545_0%,_#050510_100%)]">

            {/* Ambient Background Table */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-cyan-500/5 border border-cyan-500/10 shadow-[inner_0_0_150px_rgba(6,182,212,0.15)]" />
            </div>

            {/* Toolbar */}
            <div className="absolute top-6 left-6 z-50 flex gap-3">
                <button onClick={() => window.location.reload()} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 group transition-all">
                    <RefreshCw size={18} className="group-active:rotate-180 transition-transform" />
                </button>
                <button onClick={handleForfeit} className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-500 group transition-all flex items-center gap-2">
                    <LogOut size={18} />
                    <span className="text-[10px] font-black uppercase hidden group-hover:block">Quit</span>
                </button>
            </div>

            {/* Players Area */}
            {playersWithPos.map((p) => {
                const isMyPos = p.name === currentPlayerName;
                const role = p.role;
                return (
                    <motion.div
                        key={p.name}
                        style={getRoleStyles(role)}
                        className="absolute p-4 z-20"
                    >
                        <div className="flex flex-col items-center gap-4">
                            {/* Avatar & Status */}
                            <div className="mb-2">
                                <PlayerAvatar player={p} isTurn={turnOf === p.name} size={isMyPos ? 'lg' : 'md'} />
                            </div>

                            {/* Card Display Wrapper */}
                            <div className="relative flex items-center gap-6">
                                {/* Side Stats (Left side only for local player) */}
                                {isMyPos && isMyTurn && stage === 'idle' && (
                                    <div className="flex flex-col gap-[3px] py-1 mt-[115px]">
                                        {leftStatButtons.map(stat => (
                                            <button
                                                key={stat.id}
                                                onClick={() => handleStatSelect(stat.id)}
                                                className="w-14 h-[22px] bg-white/10 hover:bg-cyan-500/40 border border-cyan-500/20 rounded-md flex items-center justify-center text-[8px] font-black text-white transition-all hover:scale-110 active:scale-90"
                                            >
                                                {stat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* The Card Component */}
                                <AnimatePresence mode="wait">
                                    {(stage === 'idle' || (stage === 'pending' && !isMyPos)) ? (
                                        <motion.div
                                            key={`hand-${p.name}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            <Card
                                                card={isMyPos && stage === 'idle' ? p.topCard : null}
                                                isFaceUp={isMyPos && stage === 'idle'}
                                                size={isMyPos ? 'md' : 'sm'}
                                                disabled={!isMyTurn}
                                                deckId={deckId}
                                            />
                                            {!isMyPos && (
                                                <div className="mt-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest text-center">
                                                    {p.cardCount || 26} CRDS
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>

                                {/* SHOW Button Overlay for Opponents */}
                                {stage === 'pending' && !isMyTurn && !isMyPos && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#050510]/80 backdrop-blur-sm rounded-[32px] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                                    >
                                        <button
                                            onClick={handleShowCard}
                                            className="group relative w-24 h-24 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-cyan-500/20 border-4 border-black"
                                        >
                                            <span className="text-[10px] font-black italic tracking-tighter">SHOW</span>
                                            <span className="text-sm font-black">{pendingShow?.timeLeft}s</span>
                                            <div className="absolute inset-0 rounded-full border-2 border-black/10 animate-ping opacity-20 pointer-events-none" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Side Stats (Right side only for local player) */}
                                {isMyPos && isMyTurn && stage === 'idle' && (
                                    <div className="flex flex-col gap-[3px] py-1 mt-[115px]">
                                        {rightStatButtons.map(stat => (
                                            <button
                                                key={stat.id}
                                                onClick={() => handleStatSelect(stat.id)}
                                                className="w-14 h-[22px] bg-white/10 hover:bg-cyan-500/40 border border-cyan-500/20 rounded-md flex items-center justify-center text-[8px] font-black text-white transition-all hover:scale-110 active:scale-90"
                                            >
                                                {stat.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {/* Selection Notification Banner */}
            <AnimatePresence>
                {stage === 'pending' && pendingShow && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
                    >
                        <div className="bg-white text-black px-10 py-4 rounded-3xl font-black italic shadow-2xl skew-x-[-10deg] border-4 border-cyan-500 ring-4 ring-black/50">
                            <span className="text-blue-600">{pendingShow.playerName.toUpperCase()}</span>
                            <span className="mx-3 opacity-40">CHOSE</span>
                            <span className="text-red-500">{pendingShow.stat.toUpperCase()} : {pendingShow.value}</span>
                        </div>
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em] animate-pulse">
                            Waiting for opponent reveal...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Central Battle Arena */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <AnimatePresence>
                    {stage === 'revealed' && battleResults && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {battleResults.results.map((res, i) => {
                                const playerRole = playersWithPos.find(p => p.name === res.playerName)?.role;
                                const offset = getBattleOffset(playerRole);
                                const isWinner = res.playerName === battleResults.winnerName;

                                return (
                                    <motion.div
                                        key={`reveal-${res.playerName}-${i}`}
                                        initial={{
                                            x: offset.x,
                                            y: offset.y,
                                            scale: 0.5,
                                            opacity: 0,
                                            rotate: Math.random() * 20 - 10
                                        }}
                                        animate={{
                                            x: (i - (battleResults.results.length - 1) / 2) * 220, // Spread cards horizontally
                                            y: 0, // Keep them on the same horizontal line
                                            scale: isWinner ? 1 : 0.9,
                                            opacity: 1,
                                            rotate: (i - (battleResults.results.length - 1) / 2) * 5
                                        }}
                                        exit={{ scale: 0, opacity: 0, y: 500 }}
                                        className="absolute p-4 flex flex-col items-center"
                                        style={{ zIndex: isWinner ? 50 : 40 }}
                                    >
                                        <Card
                                            card={res.card}
                                            isFaceUp={true}
                                            size="md"
                                            deckId={deckId}
                                        />
                                        <div className="mt-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-black text-white italic">
                                            {res.playerName.toUpperCase()}
                                        </div>
                                        {isWinner && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-6 -right-6 bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-[10px] shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center gap-2"
                                            >
                                                <Trophy size={14} /> ROUND WINNER
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ opacity: 0, y: 200 }}
                                animate={{ opacity: 1, y: 240 }}
                                className="absolute bg-white text-black px-12 py-3 rounded-2xl font-black italic text-2xl shadow-2xl skew-x-[-10deg]"
                            >
                                {battleResults.winnerName.toUpperCase()}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Leaderboard Overlay */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className={`p-3 rounded-2xl border transition-all ${showLeaderboard ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                        }`}
                >
                    <Trophy size={18} />
                </button>
                <AnimatePresence>
                    {showLeaderboard && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: 20 }} className="absolute top-16 right-0">
                            <Leaderboard players={players} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GameBoard;
