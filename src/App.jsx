import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DecksTab from './components/DecksTab';
import SettingsTab from './components/SettingsTab';
import LeaderboardTab from './components/LeaderboardTab';
import WelcomeScreen from './components/WelcomeScreen';
import MusicController from './components/MusicController';
import { supabase } from './lib/supabase';

const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
const socket = io(backendUrl);

function App() {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [gameState, setGameState] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // New navigation and deck states
    const [activeTab, setActiveTab] = useState('decks'); // 'decks', 'arena', 'settings'
    const [equippedDeck, setEquippedDeck] = useState(null);
    const [lobbyMode, setLobbyMode] = useState('choice'); // 'choice', 'create', 'join'
    const [session, setSession] = useState(null);
    const [isNameSet, setIsNameSet] = useState(false);

    const handleWelcomeSubmit = (name) => {
        setPlayerName(name);
        setIsNameSet(true);
    };

    useEffect(() => {
        // Handle Supabase Auth Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("Supabase Session:", session);
            setSession(session);
            if (session?.user) {
                const meta = session.user.user_metadata;
                const name = meta?.full_name || meta?.name || session.user.email.split('@')[0];
                setPlayerName(name);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth State Changed:", _event, session);
            setSession(session);
            if (session?.user) {
                const meta = session.user.user_metadata;
                const name = meta?.full_name || meta?.name || session.user.email.split('@')[0];
                setPlayerName(name);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

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

        socket.on('error', (msg) => {
            alert(`SERVER ERROR: ${msg}`);
        });

        return () => {
            socket.off('playerJoined');
            socket.off('gameStarted');
            socket.off('updateState');
            socket.off('creatorChallenged');
            socket.off('error');
        };
    }, []);

    useEffect(() => {
        const handleUnload = () => {
            if (isJoined && !gameState) {
                // Handle lobby disconnect specifically if needed
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [isJoined, gameState]);

    const handleCreateRoom = () => {
        if (!playerName) return alert("Please enter your name first!");
        const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
        setRoomId(randomId);
        socket.emit('invitePlayer', { roomId: randomId, playerName });
        setIsJoined(true);
    };

    const handleJoin = () => {
        if (playerName && roomId) {
            socket.emit('invitePlayer', { roomId, playerName });
            setIsJoined(true);
        } else if (!playerName) {
            alert("Please enter your name!");
        } else if (!roomId) {
            alert("Please enter a Room ID!");
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

    const handleStartBotGame = () => {
        const id = Math.floor(Math.random() * 90 + 10).toString();
        setRoomId(id);
        setIsJoined(true);
        socket.emit('startBotGame', { roomId: id, playerName });
    };

    const handleQuit = () => {
        // Capture roomId before resetting state
        const currentRoomId = roomId || (gameState && gameState.roomId);

        setIsJoined(false);
        setGameState(null);
        setRoomId('');
        setLobbyMode('choice');
        setActiveTab('decks');

        // If in a match, notify server
        if (currentRoomId) {
            socket.emit('forfeitMatch', { roomId: currentRoomId, playerName });
        }
    };

    if (!isJoined && activeTab === 'arena') {
        // User is in arena tab but hasn't joined yet
        // This is handled by the lobby view below
    }

    if (!isNameSet) return <WelcomeScreen onNameSubmit={handleWelcomeSubmit} />;

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
                    ) : activeTab === 'leaderboard' ? (
                        <LeaderboardTab />
                    ) : (
                        <>
                            {!gameState || gameState.status === 'finished' ? (
                                /* Lobby UI (shown if no active game or game is finished) */
                                <div className="h-full flex items-center justify-center p-4">
                                    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                                        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-4 text-center ring-offset-cyan-400">
                                            ARENA <span className="text-cyan-400">LOBBY</span>
                                        </h1>
                                        <div className="flex justify-center mb-8">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest ${isConnected ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                                {isConnected ? 'SERVER CONNECTED' : 'SERVER DISCONNECTED'}
                                            </div>
                                        </div>

                                        {!isJoined ? (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Player Profile</p>
                                                    <input
                                                        type="text"
                                                        placeholder="YOUR NICKNAME"
                                                        value={playerName}
                                                        onChange={(e) => setPlayerName(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-bold tracking-tight"
                                                    />
                                                </div>

                                                {lobbyMode === 'choice' && (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <button
                                                            onClick={handleCreateRoom}
                                                            disabled={!equippedDeck || !playerName}
                                                            className="w-full h-24 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black rounded-2xl transition-all active:scale-95 disabled:opacity-20 flex flex-col items-center justify-center gap-1 shadow-xl shadow-cyan-500/10"
                                                        >
                                                            <span className="text-lg">CREATE PRIVATE ROOM</span>
                                                            <span className="text-[9px] opacity-60">Generate a unique battle code</span>
                                                        </button>

                                                        <button
                                                            onClick={handleStartBotGame}
                                                            disabled={!equippedDeck || !playerName}
                                                            className="w-full h-24 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black rounded-2xl transition-all active:scale-95 disabled:opacity-20 flex flex-col items-center justify-center gap-1 shadow-xl shadow-purple-500/10 border border-white/20"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">PLAY VS AI BOT</span>
                                                                <div className="bg-white/20 px-2 py-0.5 rounded text-[8px] tracking-[0.2em]">GPT-5 NANO</div>
                                                            </div>
                                                            <span className="text-[9px] opacity-60">Instant solo match with intelligent bot</span>
                                                        </button>

                                                        <div className="flex items-center gap-4 py-2">
                                                            <div className="h-px flex-1 bg-white/5" />
                                                            <span className="text-[10px] font-black text-white/20">OR</span>
                                                            <div className="h-px flex-1 bg-white/5" />
                                                        </div>

                                                        <button
                                                            onClick={() => setLobbyMode('join')}
                                                            disabled={!equippedDeck || !playerName}
                                                            className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-20 flex flex-col items-center justify-center gap-1"
                                                        >
                                                            <span className="text-sm">JOIN WITH CODE</span>
                                                            <span className="text-[8px] opacity-40 uppercase tracking-widest">Enter a friend's room code</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {lobbyMode === 'join' && (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Room Code</p>
                                                            <input
                                                                type="text"
                                                                placeholder="ENTER INVITE CODE (e.g. 10)"
                                                                value={roomId}
                                                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 font-mono font-bold tracking-[0.2em] text-center"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={handleJoin}
                                                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all"
                                                        >
                                                            ENTER BATTLE
                                                        </button>
                                                        <button
                                                            onClick={() => setLobbyMode('choice')}
                                                            className="w-full text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors py-2"
                                                        >
                                                            ← Go Back
                                                        </button>
                                                    </div>
                                                )}
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
                                                        onClick={() => {
                                                            console.log("Emitting startGame for room:", roomId);
                                                            handleStart();
                                                        }}
                                                        disabled={players.length < 2 || !isConnected}
                                                        className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-50 transition-all active:scale-95 shadow-xl shadow-white/5"
                                                    >
                                                        {players.length < 2 ? `WAITING FOR PLAYERS (${players.length}/2)` : 'START BATTLE'}
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
                                    onQuit={handleQuit}
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
