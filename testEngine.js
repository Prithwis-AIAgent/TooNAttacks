const GameEngine = require('./logic/gameEngine');

function runTest() {
    console.log("--- Starting TooNAttacks 4-Player Logic Test ---");

    const players = ["Alice", "Bob", "Charlie", "David"];
    const engine = new GameEngine(players);

    console.log("Players:", engine.players.map(p => p.name));
    console.log("Card Distribution:");
    engine.players.forEach(p => {
        console.log(` - ${p.name}: ${p.stack.length} cards`);
    });

    if (engine.players.every(p => p.stack.length === 13)) {
        console.log("PASS: Correct card distribution for 4 players (13 cards each).");
    } else {
        console.error("FAIL: Incorrect card distribution for 4 players.");
    }

    // Simulate a round using compareAll
    const firstTurnPlayer = engine.players[engine.turnIndex].name;
    console.log(`Turn of: ${firstTurnPlayer}`);

    const chosenStat = 'strength'; // Assuming this exists in cards.json
    console.log(`${firstTurnPlayer} selects stat: ${chosenStat}`);

    const round1 = engine.compareAll(chosenStat);
    console.log("Round 1 Winner:", round1.winnerName);
    console.log("Results:");
    round1.results.forEach(res => {
        console.log(` - ${res.playerName}: ${res.cardName} (${res.value})`);
    });

    // Verify points and card movement
    if (round1.winnerName !== "Tie") {
        const winner = engine.players.find(p => p.name === round1.winnerName);
        console.log(`Winner's Points: ${winner.points} (Expected: 5 if new winner)`);
        console.log(`Winner's Stack Size: ${winner.stack.length} (Expected: 16)`);
    } else {
        console.log("Round was a tie. Cards returned to owners.");
    }

    console.log("Leaderboard:", engine.getLeaderboard());

    // Test Blind Play
    const aliceState = engine.getGameState("Alice");
    console.log("Alice's View of Top Card:", aliceState.players.find(p => p.name === "Alice").topCard ? aliceState.players.find(p => p.name === "Alice").topCard.name : "None");
    console.log("Alice's View of Bob's Top Card (Should be null):", aliceState.players.find(p => p.name === "Bob").topCard);

    console.log("--- Test Complete ---");
}

try {
    runTest();
} catch (e) {
    console.error("Test execution failed:", e);
}
