// frontend/src/components/games/GameInstructions.jsx
import React, { useState } from 'react';
import { 
  Info, CheckCircle, AlertTriangle, Crown, Diamond, Star, 
  Music, Target, Headset, Users, Clock, DollarSign, Mic,
  Video, Wifi, Smartphone, Monitor, Gamepad2, HeartHandshake,
  Shield, Gift, Zap, Trophy, X
} from 'lucide-react';

const GameInstructions = ({ gameType, onClose, onAccept }) => {
  const [currentTab, setCurrentTab] = useState('overview');

  const gameData = {
    karaoke: {
      title: 'Virtual Karaoke Room',
      icon: Music,
      gradient: 'from-pink-500 to-purple-500',
      description: 'Sing your favorite songs with friends in real-time video chat rooms',
      
      prerequisites: {
        membership: 'Free',
        equipment: ['Microphone', 'Speakers/Headphones', 'Webcam (optional)'],
        internet: 'Stable broadband connection (min 5 Mbps)',
        browser: 'Chrome, Firefox, Safari, or Edge (latest version)',
        age: '13+ (with parental consent under 18)'
      },
      
      instructions: [
        {
          step: 1,
          title: 'Choose Your Room',
          description: 'Browse available karaoke rooms or create your own private room',
          tips: ['Public rooms: Meet new people', 'Private rooms: Invite friends with room code']
        },
        {
          step: 2,
          title: 'Set Up Audio/Video',
          description: 'Allow microphone and camera access for the best experience',
          tips: ['Test your microphone levels', 'Check your lighting', 'Use headphones to prevent echo']
        },
        {
          step: 3,
          title: 'Select Songs',
          description: 'Browse our library of thousands of songs and add them to the queue',
          tips: ['Search by artist, title, or genre', 'Preview songs before adding', 'Request songs for duets']
        },
        {
          step: 4,
          title: 'Start Singing',
          description: 'When it\'s your turn, grab the virtual mic and perform!',
          tips: ['Watch the lyrics scroll', 'Engage with your audience', 'Have fun and be yourself!']
        }
      ],
      
      rules: [
        'Be respectful to all participants',
        'No inappropriate language or content',
        'Wait your turn in the queue',
        'Keep performances under 5 minutes',
        'Report any harassment immediately'
      ],
      
      features: [
        'Real-time video chat with up to 10 people',
        'Professional scoring system',
        'Duet mode for romantic moments',
        'Song requests and dedications',
        'Audio effects and voice filters',
        'Record and share your performances'
      ],
      
      tips: [
        'Use good lighting for video chat',
        'Practice popular songs to impress',
        'Compliment other singers',
        'Don\'t be shy - everyone\'s here to have fun!',
        'Create a good profile to attract potential matches'
      ]
    },

    bingo: {
      title: 'Diamond Bingo Elite',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Exclusive high-stakes bingo for Diamond members with massive prize pools',
      
      prerequisites: {
        membership: 'Diamond ($29.99/month)',
        equipment: ['Computer or tablet with good display', 'Stable internet connection'],
        internet: 'High-speed connection (min 10 Mbps for optimal experience)',
        browser: 'Chrome or Firefox recommended for best performance',
        age: '18+ (gambling regulations)',
        credits: 'Minimum 100 credits for entry fee'
      },
      
      instructions: [
        {
          step: 1,
          title: 'Verify Diamond Status',
          description: 'Ensure your Diamond membership is active and account is verified',
          tips: ['Check membership expiry', 'Verify payment method', 'Complete identity verification']
        },
        {
          step: 2,
          title: 'Purchase Entry',
          description: 'Pay the entry fee (typically 100-500 credits) to join a game',
          tips: ['Check prize pool before entering', 'Consider game difficulty', 'Buy multiple cards for better odds']
        },
        {
          step: 3,
          title: 'Prepare Your Cards',
          description: 'Receive your bingo cards and familiarize yourself with the layout',
          tips: ['Enable auto-mark feature', 'Review your numbers', 'Use power-ups strategically']
        },
        {
          step: 4,
          title: 'Play and Win',
          description: 'Mark numbers as they\'re called and aim for winning patterns',
          tips: ['Watch for multiple cards', 'Call BINGO immediately', 'Stay focused throughout']
        }
      ],
      
      rules: [
        'Diamond membership required at all times',
        'Entry fees are non-refundable',
        'Auto-mark must be enabled for fair play',
        'Maximum 6 cards per player per game',
        'Winners must verify within 30 seconds',
        'Prizes paid out within 24 hours',
        'No collusion or cheating tolerated'
      ],
      
      features: [
        'Prize pools starting at $50,000',
        'Exclusive Diamond member chat',
        'Professional live callers',
        'Advanced power-ups and bonuses',
        'VIP customer support',
        'Leaderboards and achievements',
        'Special tournament events'
      ],
      
      tips: [
        'Play during peak hours for bigger pools',
        'Use the number preview power-up wisely',
        'Network with other Diamond members',
        'Set spending limits responsibly',
        'Practice with free games first'
      ]
    },

    vr: {
      title: 'VR Paranormal Investigation',
      icon: Headset,
      gradient: 'from-purple-500 to-red-500',
      description: 'Immersive multiplayer ghost hunting experience in virtual reality',
      
      prerequisites: {
        membership: 'Platinum ($19.99/month) or Diamond',
        equipment: ['VR Headset (Quest, Vive, Index, etc.)', 'Hand controllers', 'Room-scale setup (6x6 ft minimum)'],
        internet: 'Ultra-fast connection (min 25 Mbps) for low latency',
        browser: 'WebXR compatible browser (Chrome, Edge)',
        age: '16+ (mature content and horror themes)',
        physical: 'Ability to stand and move for extended periods'
      },
      
      instructions: [
        {
          step: 1,
          title: 'VR Setup & Calibration',
          description: 'Set up your VR headset and calibrate your play space',
          tips: ['Clear 6x6 foot area minimum', 'Check battery levels', 'Adjust headset for comfort']
        },
        {
          step: 2,
          title: 'Team Formation',
          description: 'Join or create a team of 2-6 investigators',
          tips: ['Choose complementary roles', 'Test voice chat', 'Plan investigation strategy']
        },
        {
          step: 3,
          title: 'Equipment Selection',
          description: 'Choose your ghost hunting equipment loadout',
          tips: ['EMF for initial detection', 'Thermal camera for cold spots', 'Spirit box for communication']
        },
        {
          step: 4,
          title: 'Investigation Phase',
          description: 'Explore the haunted location and gather evidence',
          tips: ['Stay together for safety', 'Document all findings', 'Manage fear levels', 'Communicate constantly']
        }
      ],
      
      rules: [
        'Platinum/Diamond membership required',
        'Must be 16+ due to horror content',
        'No disruptive behavior during investigations',
        'Respect team decisions and roles',
        'Report technical issues immediately',
        'Take breaks if experiencing motion sickness',
        'Emergency exit available at all times'
      ],
      
      features: [
        'Full VR immersion with hand tracking',
        'Realistic ghost hunting equipment',
        'Dynamic AI-driven paranormal events',
        'Team-based multiplayer (2-6 players)',
        'Voice chat with spatial audio',
        'Multiple haunted locations',
        'Progressive difficulty levels',
        'Achievement and ranking system'
      ],
      
      tips: [
        'Start with shorter sessions to build tolerance',
        'Use comfort settings if prone to motion sickness',
        'Communicate constantly with your team',
        'Don\'t let fear levels get too high',
        'Take breaks every 30 minutes',
        'Practice with equipment in safe areas first'
      ]
    }
  };

  const currentGame = gameData[gameType];
  const Icon = currentGame.icon;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'prerequisites', label: 'Requirements', icon: CheckCircle },
    { id: 'instructions', label: 'How to Play', icon: Gamepad2 },
    { id: 'rules', label: 'Rules & Safety', icon: Shield }
  ];

  const getMembershipColor = (tier) => {
    switch(tier.toLowerCase()) {
      case 'free': return 'text-gray-400';
      case 'silver': return 'text-gray-300';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-purple-400';
      case 'diamond': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getMembershipIcon = (tier) => {
    switch(tier.toLowerCase()) {
      case 'diamond': return <Diamond className="w-4 h-4" />;
      case 'platinum': return <Crown className="w-4 h-4" />;
      case 'gold': return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentGame.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentGame.title}</h2>
                <p className="text-white/80">{currentGame.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-black/20 rounded-lg p-1">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    currentTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-black/90 max-h-96 overflow-y-auto">
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-green-400" />
                  Game Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentGame.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {currentGame.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'prerequisites' && (
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-red-400">Requirements</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Please ensure you meet all requirements before joining the game.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {getMembershipIcon(currentGame.prerequisites.membership)}
                      <h4 className={`font-bold ${getMembershipColor(currentGame.prerequisites.membership)}`}>
                        Membership Required
                      </h4>
                    </div>
                    <p className="text-lg font-bold">{currentGame.prerequisites.membership}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wifi className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold">Internet Connection</h4>
                    </div>
                    <p className="text-sm text-gray-300">{currentGame.prerequisites.internet}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2"></div>