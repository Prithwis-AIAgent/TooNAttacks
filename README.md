# 🎴 TooNAttacks - Doraemon Trump Card Game

TooNAttacks is a premium, 4-player multiplayer card game that brings childhood nostalgia to life with modern web technology. Built with **React**, **Tailwind CSS**, and **Socket.io**, it features cinematic animations and a high-end glassmorphism aesthetic.

## ✨ Key Features
- **4-Player Battle Arena**: Dynamic "Cross" layout supporting 2, 3, or 4 players.
- **Cinematic Reveal**: Three-stage card animations (Fly → Flip → Award) powered by Framer Motion.
- **Deck Collection**: Immersive full-screen menu to choose between Doraemon, WWE, and Ben 10 decks.
- **State Blocking**: Intelligent UI flow that locks the Arena until a deck is equipped.
- **Modern UI**: Dark-mode glassmorphism interface with responsive sidebar navigation.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io.
- **Data**: Character-specific stats extracted from iconic Doraemon card sets.

## 🚀 How to Run Locally

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Prithwis-AIAgent/TooNAttacks.git
   cd TooNAttacks
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Match**:
   - This launches the backend (Port 3000) and the frontend (Port 5173).
   ```bash
   npm run dev
   ```

4. **Access the Game**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment & Multiplayer

> [!IMPORTANT]
> **Socket.io on Vercel**: Vercel Serverless Functions are stateless and do not support shared memory between different users. If you and your friends connect to the same URL on Vercel, you might be routed to different server instances and won't see each other in the lobby.
>
> **Recommended Hosting**:
> - **Frontend (UI)**: Vercel or Netlify.
> - **Backend (Game Logic)**: [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/). These platforms support persistent processes required for Socket.io rooms to function correctly for multiple players.

---
*Created with ❤️ for the Toon generation.*
