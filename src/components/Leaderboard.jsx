import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ players }) => {
    // Sort players by points in descending order
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>LEADERBOARD</h2>
            </div>
            <div className="leaderboard-list">
                {sortedPlayers.map((player, index) => (
                    <div key={player.name} className={`leaderboard-item rank-${index + 1}`}>
                        <span className="rank-badge">#{index + 1}</span>
                        <span className="player-name">{player.name}</span>
                        <span className="player-points">{player.points} PTS</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
