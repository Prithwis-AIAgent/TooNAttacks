import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import PlayerAvatar from './PlayerAvatar';
import Leaderboard from './Leaderboard';
import { Trophy, RefreshCw, LogOut } from 'lucide-react';

const GameBoard = ({ gameState, currentPlayerName, socket, deckId }) => {
    const [battleResults, setBattleResults] = useState(null);
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
            }, 4000);
        });

        return () => socket.off('revealWinner');
    }, [socket]);

    const handleForfeit = () => {
        if (window.confirm("Are you sure you want to forfeit the match?")) {
            window.location.reload();
        }
    };

    const getCardPos = (pos) => {
        switch (pos) {
            case 'bottom': return { bottom: '10%', left: '50%', x: '-50%' };
            case 'top': return { top: '10%', left: '50%', x: '-50%' };
            case 'left': return { left: '10%', top: '50%', y: '-50%' };
            case 'right': return { right: '10%', top: '50%', y: '-50%' };
            default: return {};
        }
    };

    const getBattlePos = (index) => {
        const offset = 60;
        const positions = [
            { x: 0, y: offset },   // Bottom
            { x: -offset, y: 0 },  // Left
            { x: 0, y: -offset },  // Top
            { x: offset, y: 0 },   // Right
        ];
        return positions[index];
    };

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[radial-gradient(circle_at_center,_#101025_0%,_#050510_100%)]">

            {/* Table Surface */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-[600px] h-[600px] rounded-full border border-cyan-500/20 shadow-[0_0_100px_rgba(34,211,238,0.1)]" />
            </div>

            {/* Utility Buttons */}
            <div className="absolute top-6 left-6 z-50 flex gap-3">
                <button
                    onClick={() => window.location.reload()}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all group"
                    title="Reload"
                >
                    <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                </button>
                <button
                    onClick={handleForfeit}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition-all flex items-center gap-2 group"
                    title="Forfeit"
                >
                    <LogOut size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block">Forfeit</span>
                </button>
            </div>

            {/* Players & Their Cards */}
            {playersWithPos.map((p, i) => (
                <div
                    key={p.name}
                    className="absolute transition-all duration-700 ease-out"
                    style={getCardPos(p.pos)}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className={`relative ${p.pos === 'bottom' ? 'order-last' : ''}`}>
                            <PlayerAvatar
                                player={p}
                                isTurn={turnOf === p.name}
                                size={p.pos === 'bottom' ? 'lg' : 'md'}
                            />
                        </div>

                        <AnimatePresence>
                            {stage === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        x: getBattlePos(i).x * 2,
                                        y: getBattlePos(i).y * 2,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    transition={{ type: "spring", damping: 20 }}
                                >
                                    <Card
                                        card={p.pos === 'bottom' ? p.topCard : null}
                                        isFaceUp={p.pos === 'bottom'}
                                        onStatClick={handleStatSelect}
                                        disabled={!isMyTurn}
                                        deckId={deckId}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence>
                    {stage === 'revealed' && battleResults && (
                        <div className="relative">
                            {battleResults.results.map((res, i) => {
                                const posIndex = reorderedPlayers.findIndex(p => p.name === res.playerName);
                                const battlePos = getBattlePos(posIndex);
                                return (
                                    <motion.div
                                        key={`battle-${res.playerName}`}
                                        initial={{
                                            x: battlePos.x * 5,
                                            y: battlePos.y * 5,
                                            opacity: 0,
                                            scale: 0.5
                                        }}
                                        animate={{
                                            x: battlePos.x,
                                            y: battlePos.y,
                                            opacity: 1,
                                            scale: 0.8
                                        }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        className="absolute"
                                    >
                                        <Card
                                            card={{
                                                name: res.cardName,
                                                stats: { [battleResults.stat]: res.value },
                                                id: players.find(p => p.name === res.playerName)?.topCard?.id
                                            }}
                                            isFaceUp={true}
                                            deckId={deckId}
                                        />
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 140 }}
                                animate={{ opacity: 1, scale: 1, y: 160 }}
                                className="absolute left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-cyan-500/30 px-8 py-3 rounded-2xl shadow-2xl z-50 text-center"
                            >
                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Winner</p>
                                <h2 className="text-xl font-black italic text-white uppercase">{battleResults.winnerName}</h2>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-3">
                <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className={`p-3 rounded-xl border transition-all duration-300 backdrop-blur-md ${showLeaderboard
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                        }`}
                >
                    <Trophy size={18} />
                </button>
                <AnimatePresence>
                    {showLeaderboard && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        >
                            <Leaderboard players={players} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GameBoard;
