/**
 * TooNAttacks Socket Handler
 * Handles real-time events for the card game.
 */

import GameEngine from './gameEngine.js';

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
            if (game && game.players.length >= 2 && game.players.length <= 4) {
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
                socket.emit('error', 'Game requires 2-4 players to start.');
            }
        });

        // Stat selection by the turn player
        socket.on('selectStat', ({ roomId, chosenStat }) => {
            const game = activeGames[roomId];
            if (game && game.status === 'started') {
                const currentPlayer = game.players.find(p => p.id === socket.id);
                const turnPlayerName = game.engine.players[game.engine.turnIndex].name;

                if (currentPlayer && currentPlayer.name === turnPlayerName) {
                    const roundResult = game.engine.compareStats(chosenStat);

                    // Reveal winner and update all players
                    io.to(roomId).emit('revealWinner', roundResult);

                    // Check for Game Over
                    if (game.engine.isGameOver()) {
                        game.status = 'finished';
                        io.to(roomId).emit('gameOver', {
                            leaderboard: game.engine.getLeaderboard(),
                            finalScores: game.engine.players.map(p => ({ name: p.name, points: p.points }))
                        });
                    } else {
                        // Notify next turn and update stacks (blind filter)
                        game.players.forEach(p => {
                            const updatedState = game.engine.getGameState(p.name);
                            io.to(p.id).emit('updateState', updatedState);
                        });
                    }
                } else {
                    socket.emit('error', 'It is not your turn to select a stat.');
                }
            }
        });

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

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Optional: Clean up activeGames if a player disconnects
        });
    });
};
