import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import PlayerAvatar from './PlayerAvatar';
import Leaderboard from './Leaderboard';
import { Trophy, RefreshCw, LogOut } from 'lucide-react';

const GameBoard = ({ gameState, currentPlayerName, socket, deckId }) => {
    const [battleResults, setBattleResults] = useState(null);
    const [stage, setStage] = useState('idle'); // idle, revealed
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const players = gameState.players || [];
    const turnOf = gameState.turnOf;
    const isMyTurn = currentPlayerName === turnOf;

    // Custom layout logic based on player count
    const getLayoutConfig = (playerCount) => {
        const myIndex = players.findIndex(p => p.name === currentPlayerName);
        const reordered = [...players.slice(myIndex), ...players.slice(0, myIndex)];

        const configs = {
            2: ['bottom', 'top'],
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
        socket.on('revealWinner', (results) => {
            setBattleResults(results);
            setStage('revealed');

            setTimeout(() => {
                setBattleResults(null);
                setStage('idle');
            }, 5000);
        });

        return () => socket.off('revealWinner');
    }, [socket]);

    const handleForfeit = () => {
        if (window.confirm("Are you sure you want to forfeit the match?")) {
            window.location.reload();
        }
    };

    // UI Position Helpers
    const getRoleStyles = (role) => {
        const styles = {
            'bottom': { bottom: '5%', left: '50%', x: '-50%' },
            'top': { top: '5%', left: '50%', x: '-50%' },
            'left': { left: '8%', top: '50%', y: '-50%' },
            'right': { right: '8%', top: '50%', y: '-50%' },
            'top-left': { top: '8%', left: '15%' },
            'top-right': { top: '8%', right: '15%' }
        };
        return styles[role] || styles['bottom'];
    };

    const getBattleOffset = (role) => {
        const offsets = {
            'bottom': { x: 0, y: 120 },
            'top': { x: 0, y: -120 },
            'left': { x: -160, y: 0 },
            'right': { x: 160, y: 0 },
            'top-left': { x: -100, y: -100 },
            'top-right': { x: 100, y: -100 }
        };
        return offsets[role] || { x: 0, y: 0 };
    };

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_center,_#151535_0%,_#050510_100%)]">

            {/* Ambient Background Table */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-cyan-500/5 border border-cyan-500/10 shadow-[inner_0_0_100px_rgba(6,182,212,0.1)]" />
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
                const isBottom = p.role === 'bottom';
                return (
                    <motion.div
                        key={p.name}
                        style={getRoleStyles(p.role)}
                        className="absolute p-4 z-20"
                    >
                        <div className="flex flex-col items-center gap-4">
                            {/* Avatar & Status */}
                            <div className={isBottom ? 'order-last' : 'order-first'}>
                                <PlayerAvatar player={p} isTurn={turnOf === p.name} size={isBottom ? 'lg' : 'md'} />
                            </div>

                            {/* Card View */}
                            <AnimatePresence>
                                {stage === 'idle' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: isBottom ? 50 : -50 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                    >
                                        <Card
                                            card={isBottom ? p.topCard : null}
                                            isFaceUp={isBottom}
                                            size={isBottom ? 'md' : 'sm'}
                                            onStatClick={handleStatSelect}
                                            disabled={!isMyTurn}
                                            deckId={deckId}
                                        />
                                        {/* Opponent Card Stack Label */}
                                        {!isBottom && (
                                            <div className="mt-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest text-center">
                                                {p.cardCount || 26} Cards Left
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                );
            })}

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
                                            x: offset.x * 2,
                                            y: offset.y * 2,
                                            scale: 0.5,
                                            opacity: 0,
                                            rotate: Math.random() * 20 - 10
                                        }}
                                        animate={{
                                            x: offset.x,
                                            y: offset.y,
                                            scale: isWinner ? 1 : 0.85,
                                            opacity: 1,
                                            rotate: (i - 1) * 10
                                        }}
                                        exit={{ scale: 0, opacity: 0, y: 500 }}
                                        className="absolute"
                                        style={{ zIndex: isWinner ? 50 : 40 }}
                                    >
                                        <Card
                                            card={{
                                                name: res.cardName,
                                                stats: { [battleResults.stat]: res.value },
                                                id: players.find(p => p.name === res.playerName)?.topCard?.id
                                            }}
                                            isFaceUp={true}
                                            size="md"
                                            deckId={deckId}
                                        />
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
