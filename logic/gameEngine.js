/**
 * TooNAttacks Game Engine
 * Handles multiplayer battle logic for 2-4 players.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GameEngine {
    constructor(players) {
        if (players.length < 2 || players.length > 4) {
            throw new Error("Game requires between 2 and 4 players.");
        }
        this.players = players.map(name => ({
            name: name,
            stack: [],
            points: 0
        }));
        this.deck = [];
        this.leaderboard = []; // In-memory leaderboard
        this.loadCards();
        this.shuffleDeck();
        this.distributeCards();
        this.currentRound = 0;
        this.turnIndex = 0; // Index of player who picks the stat
    }

    loadCards() {
        try {
            const data = fs.readFileSync(path.join(__dirname, '../cards.json'), 'utf8');
            this.deck = JSON.parse(data);
        } catch (error) {
            console.error("Error loading cards.json:", error);
            this.deck = [];
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    distributeCards() {
        // Ensure we only use 52 cards if the deck is larger, or all cards if smaller.
        const totalCards = Math.min(this.deck.length, 52);
        const cardsPerPlayer = Math.floor(totalCards / this.players.length);

        console.log(`Distributing ${totalCards} cards to ${this.players.length} players (${cardsPerPlayer} each).`);

        this.players.forEach((player, index) => {
            player.stack = this.deck.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer);
        });
    }

    /**
     * Compare the selected stat among the top cards of all players.
     * Aliased to compareStats as per requirement.
     * @param {string} chosenStat 
     */
    compareAll(chosenStat) {
        return this.compareStats(chosenStat);
    }

    /**
     * Compare the selected stat among the top cards of all players.
     * @param {string} chosenStat - The stat being compared (e.g., 'strength', 'intelligence_iq')
     */
    compareStats(chosenStat) {
        if (this.isGameOver()) return { error: "Game Over" };

        const roundCards = this.players.map(p => ({
            playerName: p.name,
            card: p.stack.shift() // Pick top card
        }));

        let roundWinnerIndex = 0;
        let tie = false;
        let maxValue = roundCards[0].card.stats[chosenStat];

        for (let i = 1; i < roundCards.length; i++) {
            const currentVal = roundCards[i].card.stats[chosenStat];
            if (currentVal > maxValue) {
                maxValue = currentVal;
                roundWinnerIndex = i;
                tie = false;
            } else if (currentVal === maxValue) {
                tie = true;
            }
        }

        const cardsToMove = roundCards.map(rc => rc.card);

        if (!tie) {
            const winner = this.players[roundWinnerIndex];
            winner.stack.push(...cardsToMove); // Winner gets all cards at bottom of stack
            winner.points += 5; // Award 5 points
            this.updateLeaderboard(winner.name, 5);
        } else {
            // In case of a tie, cards are usually discarded or held for next round.
            // For this implementation, we'll put them back at the bottom of respective owners or discard.
            // Let's put them back at the bottom for now to avoid losing cards.
            this.players.forEach((p, idx) => {
                p.stack.push(roundCards[idx].card);
            });
        }

        this.currentRound++;
        // The winner of the round typically picks the next stat, or it rotates.
        // User didn't specify, so let's keep rotation or set to winner.
        if (!tie) {
            this.turnIndex = roundWinnerIndex;
        } else {
            this.turnIndex = (this.turnIndex + 1) % this.players.length;
        }

        return {
            round: this.currentRound,
            stat: chosenStat,
            results: roundCards.map(rc => ({
                playerName: rc.playerName,
                cardName: rc.card.name,
                value: rc.card.stats[chosenStat]
            })),
            winnerName: tie ? "Tie" : this.players[roundWinnerIndex].name,
            leaderboard: this.getLeaderboard()
        };
    }

    updateLeaderboard(playerName, points) {
        let entry = this.leaderboard.find(e => e.name === playerName);
        if (entry) {
            entry.points += points;
        } else {
            this.leaderboard.push({ name: playerName, points: points });
        }
        this.leaderboard.sort((a, b) => b.points - a.points);
    }

    getLeaderboard() {
        return this.leaderboard;
    }

    isGameOver() {
        // Game ends if any player runs out of cards (or if only one player has cards left)
        return this.players.some(p => p.stack.length === 0);
    }

    getGameState(requestingPlayerName) {
        return {
            players: this.players.map(p => ({
                name: p.name,
                cardCount: p.stack.length,
                topCard: p.name === requestingPlayerName ? {
                    ...p.stack[0],
                    imagePath: this.getCardImagePath(p.stack[0].id)
                } : null // Blind play: hide others' cards
            })),
            turnOf: this.players[this.turnIndex].name
        };
    }

    getCardImagePath(cardId) {
        return `/Doraemon Cards/${cardId}.jpg`;
    }
}

export default GameEngine;
