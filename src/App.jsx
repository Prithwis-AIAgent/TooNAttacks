import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DecksTab from './components/DecksTab';
import SettingsTab from './components/SettingsTab';

const socket = io('http://localhost:3000'); // Dynamic based on env

function App() {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [gameState, setGameState] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [players, setPlayers] = useState([]);

    // New navigation and deck states
    const [activeTab, setActiveTab] = useState('decks'); // 'decks', 'arena'
    const [equippedDeck, setEquippedDeck] = useState(null);

    useEffect(() => {
        socket.on('playerJoined', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('gameStarted', (data) => {
            setGameState({ ...data.gameState, roomId: data.roomId });
            setIsJoined(true);
            setActiveTab('arena'); // Auto-switch to arena when game starts
        });

        socket.on('updateState', (updatedState) => {
            setGameState(prev => ({ ...prev, ...updatedState }));
        });

        socket.on('creatorChallenged', ({ challengerName }) => {
            alert(`CHALLENGE! ${challengerName} has challenged Prithwis!`);
        });

        return () => {
            socket.off('playerJoined');
            socket.off('gameStarted');
            socket.off('updateState');
            socket.off('creatorChallenged');
        };
    }, []);

    const handleJoin = () => {
        if (playerName && roomId) {
            socket.emit('invitePlayer', { roomId, playerName });
            setIsJoined(true);
        }
    };

    const handleStart = () => {
        socket.emit('startGame', roomId);
    };

    const handleChallenge = () => {
        socket.emit('challengeCreator', { roomId, challengerName: playerName });
    };

    const handleEquipDeck = (deck) => {
        setEquippedDeck(deck);
        // Notification or visual feedback
    };

    if (!isJoined && activeTab === 'arena') {
        // User is in arena tab but hasn't joined yet
        // This is handled by the lobby view below
    }

    return (
        <div className="flex h-screen bg-[#050510] text-white overflow-hidden font-['Outfit']">
            {/* Refined Sidebar Navigation */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isArenaLocked={!equippedDeck}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Dynamic Header */}
                <Header equippedDeck={equippedDeck} />

                <main className="flex-1 relative overflow-y-auto">
                    {activeTab === 'decks' ? (
                        <DecksTab
                            equippedDeck={equippedDeck}
                            onEquip={handleEquipDeck}
                        />
                    ) : activeTab === 'settings' ? (
                        <SettingsTab />
                    ) : (
                        <>
                            {!gameState ? (
                                /* Lobby UI */
                                <div className="h-full flex items-center justify-center p-4">
                                    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                                        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-8 text-center ring-offset-cyan-400">
                                            ARENA <span className="text-cyan-400">LOBBY</span>
                                        </h1>

                                        {!isJoined ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="YOUR NAME"
                                                    value={playerName}
                                                    onChange={(e) => setPlayerName(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="ROOM ID"
                                                    value={roomId}
                                                    onChange={(e) => setRoomId(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                                                />
                                                <button
                                                    onClick={handleJoin}
                                                    disabled={!equippedDeck}
                                                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    {equippedDeck ? 'JOIN ARENA' : 'EQUIP DECK FIRST'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="pt-4">
                                                <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl text-center">
                                                    <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase mb-1">Invite Code</p>
                                                    <p className="text-2xl font-mono font-bold text-white tracking-widest">{roomId}</p>
                                                    <p className="text-[9px] text-gray-500 mt-2 italic">Share this code with your friends</p>
                                                </div>
                                                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 text-center">Players in Room ({players.length}/4)</h3>
                                                <div className="grid grid-cols-2 gap-2 mb-8">
                                                    {players.map(p => (
                                                        <div key={p.id} className="bg-white/5 px-3 py-2 rounded-lg text-white text-sm border border-white/5 flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                            <span className="truncate">{p.name}</span>
                                                        </div>
                                                    ))}
                                                    {[...Array(4 - players.length)].map((_, i) => (
                                                        <div key={`empty-${i}`} className="bg-white/5 px-3 py-2 rounded-lg text-white/20 text-sm border border-white/5 border-dashed flex items-center justify-center">
                                                            Waiting...
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={handleStart}
                                                        disabled={players.length < 2}
                                                        className="w-full bg-white text-black font-black py-3 rounded-xl text-sm disabled:opacity-30"
                                                    >
                                                        START BATTLE
                                                    </button>
                                                    <button
                                                        onClick={handleChallenge}
                                                        className="w-full border border-white/20 text-white font-bold py-2 rounded-xl text-xs hover:bg-white/5 transition-colors"
                                                    >
                                                        CHALLENGE CREATOR
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Active Game Board */
                                <GameBoard
                                    gameState={gameState}
                                    currentPlayerName={playerName}
                                    socket={socket}
                                    deckId={equippedDeck?.id}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
