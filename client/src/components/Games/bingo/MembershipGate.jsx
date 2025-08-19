// src/components/games/bingo/MembershipGate.jsx
import React from 'react';
import { Diamond, Crown, Trophy, Gift, Video, Star } from 'lucide-react';

const MembershipGate = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="text-center p-8 max-w-4xl">
        <div className="text-8xl mb-6">💎</div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Diamond Members Only
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Upgrade to Diamond membership to access our exclusive virtual bingo games
        </p>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-blue-400">Diamond Membership Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-center space-x-3">
              <Diamond className="w-6 h-6 text-blue-400" />
              <span>Exclusive bingo games with premium prizes up to $125,000</span>
            </div>
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span>VIP treatment and priority customer support</span>
            </div>
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-purple-400" />
              <span>Access to high-stakes tournaments and jackpots</span>
            </div>
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-pink-400" />
              <span>Exclusive power-ups and game bonuses</span>
            </div>
            <div className="flex items-center space-x-3">
              <Video className="w-6 h-6 text-green-400" />
              <span>Video chat with other diamond members</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-orange-400" />
              <span>Diamond-only leaderboards and achievements</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Current Membership: {user?.membershipTier || 'Free'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-600/20 p-4 rounded-lg">
              <h4 className="font-bold text-gray-400 mb-2">Free Tier</h4>
              <ul className="space-y-1 text-gray-500">
                <li>• Basic games only</li>
                <li>• Limited prizes</li>
                <li>• Text chat only</li>
              </ul>
            </div>
            <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-500/30">
              <h4 className="font-bold text-blue-400 mb-2">Diamond Tier</h4>
              <ul className="space-y-1 text-blue-300">
                <li>• Exclusive premium games</li>
                <li>• $50K+ prize pools</li>
                <li>• Video & voice chat</li>
                <li>• Power-ups & bonuses</li>
                <li>• VIP tournaments</li>
              </ul>
            </div>
            <div className="bg-purple-600/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-400 mb-2">Platinum+ Tiers</h4>
              <ul className="space-y-1 text-purple-300">
                <li>• All Diamond benefits</li>
                <li>• Even higher limits</li>
                <li>• Personal concierge</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-x-4">
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
            Upgrade to Diamond - $29.99/month
          </button>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Go Back
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mt-6">
          Diamond membership includes 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default MembershipGate;