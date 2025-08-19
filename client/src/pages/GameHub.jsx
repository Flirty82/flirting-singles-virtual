import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, Target, Headset, Crown, Diamond, Star, Users, 
  Clock, DollarSign, Trophy, Lock, ArrowRight, Sparkles,
  Gift, Zap, Heart
} from 'lucide-react';
import { useMembership } from '../hooks/useMembership';
import { useFirebase } from '../hooks/useFirebase';
import { MEMBERSHIP_TIERS, GAME_CONFIG } from '../utils/firebase';

const GameHub = () => {
  const navigate = useNavigate();
  const { user, membership, hasAccess } = useMembership();
  const { getActiveRooms, getLeaderboard } = useFirebase();
  
  const [activeRooms, setActiveRooms] = useState({
    karaoke: 0,
    bingo: 0,
    vr: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    loadActiveRooms();
    loadLeaderboard();
  }, []);

  const loadActiveRooms = async () => {
    try {
      const rooms = await getActiveRooms();
      setActiveRooms(rooms);
    } catch (error) {
      console.error('Error loading active rooms:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const games = [
    {
      id: 'karaoke',
      title: 'Virtual Karaoke',
      subtitle: 'Sing your heart out',
      description: 'Join virtual karaoke rooms with video chat, real-time scoring, and premium songs',
      icon: Music,
      gradient: 'from-pink-500 to-purple-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      requiredTier: 'free',
      features: [
        'Real-time video chat',
        'Professional scoring system',
        'Duet mode available',
        'Song requests and queue',
        'Audio effects and filters'
      ],
      participants: activeRooms.karaoke,
      maxParticipants: GAME_CONFIG.KARAOKE.MAX_PARTICIPANTS,
      entryFee: GAME_CONFIG.KARAOKE.ENTRY_FEE,
      route: '/games/karaoke'
    },
    {
      id: 'bingo',
      title: 'Diamond Bingo Elite',
      subtitle: 'Premium members only',
      description: 'Exclusive high-stakes bingo with massive prize pools and diamond-only features',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      requiredTier: 'diamond',
      features: [
        'Massive prize pools ($50K+)',
        'Premium power-ups',
        'Diamond member chat',
        'Exclusive tournaments',
        'VIP customer support'
      ],
      participants: activeRooms.bingo,
      maxParticipants: GAME_CONFIG.BINGO.MAX_PARTICIPANTS,
      entryFee: GAME_CONFIG.BINGO.ENTRY_FEE,
      prizePool: GAME_CONFIG.BINGO.PRIZE_POOL,
      route: '/games/bingo'
    },
    {
      id: 'vr',
      title: 'VR Paranormal Investigation',
      subtitle: 'Platinum+ members',
      description: 'Immersive VR ghost hunting with team-based investigations and real paranormal encounters',
      icon: Headset,
      gradient: 'from-purple-500 to-red-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      requiredTier: 'platinum',
      features: [
        'Full VR immersion',
        'Team ghost hunting',
        'Professional equipment',
        'Multiplayer voice chat',
        'Achievement system'
      ],
      participants: activeRooms.vr,
      maxParticipants: GAME_CONFIG.VR_PARANORMAL.MAX_PARTICIPANTS,
      entryFee: GAME_CONFIG.VR_PARANORMAL.ENTRY_FEE,
      prizePool: GAME_CONFIG.VR_PARANORMAL.PRIZE_POOL,
      route: '/games/vr'
    }
  ];

  const getMembershipIcon = (tier) => {
    switch (tier) {
      case 'diamond': return <Diamond className="w-4 h-4 text-blue-400" />;
      case 'platinum': return <Crown className="w-4 h-4 text-purple-400" />;
      case 'gold': return <Star className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const canAccessGame = (game) => {
    return hasAccess(game.requiredTier);
  };

  const handleGameSelect = (game) => {
    if (canAccessGame(game)) {
      navigate(game.route);
    } else {
      setSelectedGame(game);
    }
  };

  const getUpgradePrice = (targetTier) => {
    return MEMBERSHIP_TIERS[targetTier.toUpperCase()]?.price || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Virtual Game Hub
            </h1>
            <p className="text-xl text-gray-300">
              Premium dating experiences through immersive gaming
            </p>
          </div>
          
          {/* User Status */}
          <div className="flex items-center justify-center space-x-6 bg-black/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              {getMembershipIcon(membership?.tier)}
              <span className="font-medium">{membership?.tier || 'Free'} Member</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>{user?.credits?.toLocaleString() || 0} Credits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span>{user?.totalWins || 0} Wins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
              Available Games
            </h2>
            
            <div className="space-y-6">
              {games.map(game => {
                const hasGameAccess = canAccessGame(game);
                const Icon = game.icon;
                
                return (
                  <div
                    key={game.id}
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      hasGameAccess 
                        ? `${game.borderColor} hover:scale-[1.02] cursor-pointer` 
                        : 'border-gray-600 opacity-75'
                    }`}
                    onClick={() => handleGameSelect(game)}
                  >
                    <div className={`${game.bgColor} backdrop-blur-sm p-6`}>
                      {/* Game Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`bg-gradient-to-r ${game.gradient} p-3 rounded-xl`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{game.title}</h3>
                            <p className="text-gray-300">{game.subtitle}</p>
                          </div>
                        </div>
                        
                        {!hasGameAccess && (
                          <div className="flex items-center space-x-1 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-lg">
                            <Lock className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-sm">Locked</span>
                          </div>
                        )}
                      </div>

                      {/* Game Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                          <div className="text-sm text-gray-300">Active Players</div>
                          <div className="font-bold">{game.participants}/{game.maxParticipants}</div>
                        </div>
                        
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-400" />
                          <div className="text-sm text-gray-300">Entry Fee</div>
                          <div className="font-bold">{game.entryFee} Credits</div>
                        </div>
                        
                        {game.prizePool && (
                          <div className="bg-black/20 rounded-lg p-3 text-center">
                            <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                            <div className="text-sm text-gray-300">Prize Pool</div>
                            <div className="font-bold">${game.prizePool.toLocaleString()}</div>
                          </div>
                        )}
                        
                        <div className="bg-black/20 rounded-lg p-3 text-center">
                          <Clock className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                          <div className="text-sm text-gray-300">Duration</div>
                          <div className="font-bold">{game.id === 'karaoke' ? '60 min' : '30 min'}</div>
                        </div>
                      </div>

                      {/* Game Description */}
                      <p className="text-gray-300 mb-4">{game.description}</p>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {game.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getMembershipIcon(game.requiredTier)}
                          <span className="text-sm text-gray-400 capitalize">
                            {game.requiredTier}+ Required
                          </span>
                        </div>
                        
                        {hasGameAccess ? (
                          <button className={`bg-gradient-to-r ${game.gradient} hover:opacity-90 px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2`}>
                            <span>Enter Game</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGame(game);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Upgrade to Access
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Global Leaderboard
              </h3>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-gray-400">{player.wins} wins</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">
                      ${player.earnings?.toLocaleString() || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Benefits */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-purple-400" />
                Membership Benefits
              </h3>
              
              <div className="space-y-3">
                {Object.entries(MEMBERSHIP_TIERS).slice(1).map(([tier, info]) => (
                  <div key={tier} className={`p-3 rounded-lg border ${
                    membership?.tier === tier.toLowerCase() 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getMembershipIcon(tier.toLowerCase())}
                        <span className="font-medium">{info.name}</span>
                      </div>
                      <span className="font-bold text-green-400">${info.price}/mo</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Access: {info.games.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Music className="w-4 h-4 text-pink-400" />
                  <span>12 users singing in karaoke rooms</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>Diamond bingo starting in 5 minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Headset className="w-4 h-4 text-purple-400" />
                  <span>VR investigation session active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {selectedGame && !canAccessGame(selectedGame) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="text-center mb-6">
              <div className={`bg-gradient-to-r ${selectedGame.gradient} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <selectedGame.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedGame.title}</h2>
              <p className="text-gray-300">
                Upgrade to {selectedGame.requiredTier} membership to access this premium game
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span>Required Membership:</span>
                <span className="font-bold capitalize text-purple-400">{selectedGame.requiredTier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly Cost:</span>
                <span className="font-bold text-green-400">${getUpgradePrice(selectedGame.requiredTier)}/month</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle upgrade logic
                  console.log(`Upgrading to ${selectedGame.requiredTier}`);
                  setSelectedGame(null);
                }}
                className={`flex-1 bg-gradient-to-r ${selectedGame.gradient} hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition-all`}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHub;