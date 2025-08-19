// src/components/games/bingo/DiamondBingo.jsx
import React, { useState, useEffect } from 'react';
import { Phone, DollarSign, Zap } from 'lucide-react';
import MembershipGate from './MembershipGate';
import GameHeader from './GameHeader';
import GameStatus from './GameStatus';
import BingoCard from './BingoCard';
import CalledNumbers from './CalledNumbers';
import PlayerList from './PlayerList';
import ChatPanel from './ChatPanel';
import PowerUps from './PowerUps';
import Leaderboard from './Leaderboard';
import GameControls from './GameControls';
import WinModal from './WinModal';
import { useBingoGame } from '../../../hooks/useBingoGame';
import { useMembership } from '../../../hooks/useMembership';

const DiamondBingo = () => {
  const { user, hasAccess } = useMembership();
  const {
    gameState,
    currentGame,
    bingoCard,
    calledNumbers,
    currentNumber,
    markedNumbers,
    hasWon,
    winType,
    players,
    chatMessages,
    powerUps,
    leaderboard,
    gameSettings,
    joinGame,
    startNewGame,
    callNumber,
    markNumber,
    sendMessage,
    setPowerUps,
    setGameSettings
  } = useBingoGame(user);

  // Show membership gate if no access
  if (!hasAccess) {
    return <MembershipGate user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <GameHeader user={user} currentGame={currentGame} />
      
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-3 space-y-6">
          <GameStatus 
            gameState={gameState}
            currentGame={currentGame}
            currentNumber={currentNumber}
            onJoinGame={joinGame}
            onStartNewGame={startNewGame}
            onCallNumber={callNumber}
            user={user}
          />
          
          <BingoCard 
            bingoCard={bingoCard}
            calledNumbers={calledNumbers}
            markedNumbers={markedNumbers}
            onMarkNumber={markNumber}
            hasWon={hasWon}
            winType={winType}
            powerUps={powerUps}
            setPowerUps={setPowerUps}
          />
          
          <CalledNumbers 
            calledNumbers={calledNumbers}
            currentNumber={currentNumber}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PlayerList players={players} />
          <ChatPanel 
            chatMessages={chatMessages}
            onSendMessage={sendMessage}
            user={user}
          />
          <PowerUps 
            powerUps={powerUps}
            setPowerUps={setPowerUps}
            user={user}
          />
          <Leaderboard leaderboard={leaderboard} />
          <GameControls 
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
          />
        </div>
      </div>

      {/* Win Modal */}
      {hasWon && (
        <WinModal 
          user={user}
          currentGame={currentGame}
          winType={winType}
          calledNumbers={calledNumbers}
          gameState={gameState}
          onClose={() => setHasWon(false)}
        />
      )}
    </div>
  );
};

export default DiamondBingo;