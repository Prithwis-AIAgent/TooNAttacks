import GameEngine from './gameEngine.js';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Supabase Server-side Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default (io) => {
    let activeGames = {};
    const CREATOR_ID = "Prithwis";

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Invitation logic
        socket.on('invitePlayer', ({ roomId, playerName }) => {
            socket.join(roomId);
            console.log(`${playerName} (ID: ${socket.id}) invited to room: ${roomId}`);

            if (!activeGames[roomId]) {
                activeGames[roomId] = {
                    players: [],
                    engine: null,
                    status: 'waiting'
                };
            }

            // Check if player already in room
            if (!activeGames[roomId].players.find(p => p.id === socket.id)) {
                activeGames[roomId].players.push({ id: socket.id, name: playerName });
            }

            io.to(roomId).emit('playerJoined', activeGames[roomId].players);
        });

        // Start game specifically for 2-4 players
        socket.on('startGame', (roomId) => {
            const game = activeGames[roomId];
            console.log(`Starting game for room: ${roomId}. Players:`, game?.players?.length);

            if (game && game.players.length >= 2 && game.players.length <= 4) {
                console.log('Game requirements met. Initializing engine...');
                const playerNames = game.players.map(p => p.name);
                game.engine = new GameEngine(playerNames);
                game.status = 'started';

                // Send initial state to each player (blind play filter)
                game.players.forEach(p => {
                    const initialState = game.engine.getGameState(p.name);
                    io.to(p.id).emit('gameStarted', {
                        roomId,
                        players: game.players.map(pl => pl.name),
                        gameState: initialState
                    });
                });
            } else {
                console.log('Game start rejected. Reason: Invalid player count or room not found.');
                socket.emit('error', 'Game requires 2-4 players to start.');
            }
        });

        // Start Solo Game against AI Bot
        socket.on('startBotGame', ({ roomId, playerName }) => {
            console.log(`Starting BOT game for ${playerName} in room ${roomId}`);
            socket.join(roomId);

            const botPlayer = { id: 'bot-' + roomId, name: 'BOT', isBot: true };
            activeGames[roomId] = {
                players: [{ id: socket.id, name: playerName }, botPlayer],
                engine: null,
                status: 'started',
                isBotGame: true,
                botId: botPlayer.id
            };

            const game = activeGames[roomId];
            game.engine = new GameEngine([playerName, 'BOT']);

            game.players.forEach(p => {
                if (!p.isBot) {
                    const initialState = game.engine.getGameState(p.name);
                    io.to(p.id).emit('gameStarted', {
                        roomId,
                        players: game.players.map(pl => pl.name),
                        gameState: initialState
                    });
                }
            });

            // Check if it's bot's turn first
            checkBotTurn(roomId);
        });

        // Stat selection by the turn player
        socket.on('selectStat', ({ roomId, chosenStat }) => {
            const game = activeGames[roomId];
            if (game && game.status === 'started') {
                const currentPlayer = game.players.find(p => p.id === socket.id);
                const turnPlayerName = game.engine.players[game.engine.turnIndex].name;

                if (currentPlayer && currentPlayer.name === turnPlayerName) {
                    const roundResult = game.engine.compareStats(chosenStat);

                    // Store pending result for this room
                    game.pendingReveal = roundResult;

                    // Notify all players that a stat was chosen
                    io.to(roomId).emit('statChosen', {
                        playerName: turnPlayerName,
                        stat: chosenStat,
                        value: roundResult.results.find(r => r.playerName === turnPlayerName).value
                    });

                    // In a bot game, automatically reveal after a short delay
                    if (game.isBotGame) {
                        setTimeout(() => processReveal(roomId), 2000);
                    } else {
                        // Set a 5s auto-reveal timer for multiplayer
                        if (game.revealTimer) clearTimeout(game.revealTimer);
                        game.revealTimer = setTimeout(() => {
                            processReveal(roomId);
                        }, 5000);
                    }
                } else {
                    socket.emit('error', 'It is not your turn to select a stat.');
                }
            }
        });

        // Opponent "SHOW" button trigger
        socket.on('showCard', (roomId) => {
            processReveal(roomId);
        });

        function processReveal(roomId) {
            const game = activeGames[roomId];
            if (!game || !game.pendingReveal) return;

            if (game.revealTimer) clearTimeout(game.revealTimer);
            const roundResult = game.pendingReveal;
            game.pendingReveal = null;

            // Reveal winner and update all players
            io.to(roomId).emit('revealWinner', roundResult);

            // Check for Game Over
            if (game.engine.isGameOver()) {
                game.status = 'finished';
                const finalScores = game.engine.players.map(p => ({
                    name: p.name,
                    points: p.points
                }));

                io.to(roomId).emit('gameOver', {
                    leaderboard: game.engine.getLeaderboard(),
                    finalScores
                });

                // Only persist human results
                saveMatchResults(finalScores.filter(s => s.name !== 'BOT'));
            } else {
                // Notify next turn and update stacks (blind filter)
                game.players.forEach(p => {
                    if (!p.isBot) {
                        const updatedState = game.engine.getGameState(p.name);
                        io.to(p.id).emit('updateState', updatedState);
                    }
                });

                // Check if next turn is BOT
                setTimeout(() => checkBotTurn(roomId), 1500);
            }
        }

        async function checkBotTurn(roomId) {
            const game = activeGames[roomId];
            if (!game || game.status !== 'started' || !game.isBotGame) return;

            const turnIndex = game.engine.turnIndex;
            const turnPlayerName = game.engine.players[turnIndex].name;

            if (turnPlayerName === 'BOT') {
                console.log("BOT calculating move...");
                const botCard = game.engine.players[turnIndex].stack[0];
                const stats = botCard.stats;

                try {
                    const prompt = `You are playing a luxury card game 'TooNAttacks'. Your current card is '${botCard.name}'. 
                    Its stats are: ${JSON.stringify(stats)}. 
                    Pick the best stat to win. Return ONLY the stat key from this list: [intelligence_iq, power_level, agility, strength, experience, combat_skill, charisma, luck].
                    No other text. Just the key.`;

                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini", // Or gpt-3.5-turbo if you prefer, user said gpt5nano usually means smaller fast model
                        messages: [
                            { role: "system", content: "You are a competitive card game bot." },
                            { role: "user", content: prompt }
                        ],
                        max_tokens: 10
                    });

                    const chosenStat = completion.choices[0].message.content.trim().toLowerCase();
                    console.log(`BOT selected: ${chosenStat}`);

                    // Simulate stat selection
                    handleBotAction(roomId, chosenStat);
                } catch (err) {
                    console.error("AI Error:", err);
                    // Fallback to highest stat
                    const fallback = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
                    handleBotAction(roomId, fallback);
                }
            }
        }

        function handleBotAction(roomId, chosenStat) {
            const game = activeGames[roomId];
            if (!game) return;

            const roundResult = game.engine.compareStats(chosenStat);
            game.pendingReveal = roundResult;

            io.to(roomId).emit('statChosen', {
                playerName: 'BOT',
                stat: chosenStat,
                value: roundResult.results.find(r => r.playerName === 'BOT').value
            });

            // Set reveal timer
            game.revealTimer = setTimeout(() => {
                processReveal(roomId);
            }, 3000);
        }

        // Add auto-reveal when human selects stat in bot game
        const _originalProcessReveal = processReveal;
        // In bot games, we don't need human to click "show" for the bot.
        // I will modify selectStat to trigger bots "show" if it's a bot game.

        // Creator Challenge logic
        socket.on('challengeCreator', ({ roomId, challengerName }) => {
            console.log(`Creator Challenge triggered by ${challengerName} in room ${roomId}`);
            // This event targets the specified room for the 4-player lobby
            io.to(roomId).emit('creatorChallenged', {
                roomId,
                challengerName,
                targetId: CREATOR_ID
            });
        });

        socket.on('forfeitMatch', ({ roomId, playerName }) => {
            console.log(`Forfeit request from ${playerName} in room ${roomId}`);
            const game = activeGames[roomId];
            if (game && (game.status === 'started' || game.status === 'lobby')) {
                game.status = 'finished';

                console.log(`Terminating game in room ${roomId} due to forfeit.`);

                // Award points to other players
                const others = game.engine ? game.engine.players.filter(p => p.name !== playerName) : [];
                others.forEach(p => {
                    p.points += 10; // Award 10 points for a forfeit win
                    game.engine.updateLeaderboard(p.name, 10);
                });

                const finalScores = game.engine ? game.engine.players.map(p => ({
                    name: p.name,
                    points: p.points
                })) : [];

                io.to(roomId).emit('gameOver', {
                    reason: `${playerName} forfeited`,
                    leaderboard: game.engine ? game.engine.getLeaderboard() : [],
                    finalScores
                });

                // Persist results
                if (finalScores.length > 0) {
                    saveMatchResults(finalScores);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Clean up: find which room this player was in
            for (const rId in activeGames) {
                const game = activeGames[rId];
                const playerIndex = game.players.findIndex(p => p.id === socket.id);

                if (playerIndex !== -1) {
                    const playerName = game.players[playerIndex].name;
                    game.players.splice(playerIndex, 1);
                    console.log(`Removed ${playerName} from room ${rId} due to disconnect.`);

                    // If a game was active, it's now over due to forfeit
                    if (game.status === 'started' && game.engine) {
                        game.status = 'finished';

                        // Award points to remaining players
                        const remaining = game.engine.players.filter(p => p.id !== socket.id);
                        remaining.forEach(p => {
                            p.points += 10;
                            game.engine.updateLeaderboard(p.name, 10);
                        });

                        const finalScores = game.engine.players.map(p => ({
                            name: p.name,
                            points: p.points
                        }));

                        io.to(rId).emit('gameOver', {
                            reason: `${playerName} disconnected`,
                            leaderboard: game.engine.getLeaderboard(),
                            finalScores
                        });

                        saveMatchResults(finalScores);
                    } else {
                        // Just notify others of the lobby change
                        io.to(rId).emit('playerJoined', game.players);
                    }
                }
            }
        });
    });

    async function saveMatchResults(scores) {
        console.log("Saving match results to Supabase...");
        for (const score of scores) {
            try {
                const { error } = await supabase
                    .from('leaderboard')
                    .insert({
                        player_name: score.name,
                        score: score.points
                    });

                if (error) console.error("Supabase Save Error:", error.message);
            } catch (err) {
                console.error("Database connection failed:", err.message);
            }
        }
    }
};
