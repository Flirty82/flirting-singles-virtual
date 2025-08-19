// src/hooks/useMembership.js
import { useState, useEffect } from 'react';

export const useMembership = () => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Alexandra',
    avatar: '💎',
    membershipTier: 'diamond', // Change to 'free', 'silver', 'gold', 'platinum', 'diamond'
    diamondLevel: 3, // 1-5 diamond levels
    credits: 2500,
    vipScore: 15420,
    joinDate: new Date('2023-01-15'),
    totalWins: 89,
    totalEarnings: 625000
  });

  const [hasAccess, setHasAccess] = useState(false);

  // Check membership access
  useEffect(() => {
    checkMembershipAccess();
  }, [user.membershipTier]);

  const checkMembershipAccess = () => {
    // Only diamond members can access the premium bingo
    if (user.membershipTier === 'diamond') {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  };

  const upgradeMembership = async (targetTier) => {
    try {
      // In a real app, this would make an API call to your payment processor
      console.log(`Upgrading to ${targetTier} membership...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(prev => ({
        ...prev,
        membershipTier: targetTier,
        diamondLevel: targetTier === 'diamond' ? 1 : prev.diamondLevel
      }));
      
      return { success: true, message: `Successfully upgraded to ${targetTier}!` };
    } catch (error) {
      return { success: false, message: 'Upgrade failed. Please try again.' };
    }
  };

  const getMembershipBenefits = (tier) => {
    const benefits = {
      free: {
        bingoAccess: false,
        maxCredits: 100,
        supportLevel: 'basic',
        features: ['Basic games', 'Text chat', 'Standard prizes']
      },
      silver: {
        bingoAccess: false,
        maxCredits: 500,
        supportLevel: 'standard',
        features: ['More games', 'Voice chat', 'Better prizes']
      },
      gold: {
        bingoAccess: false,
        maxCredits: 1000,
        supportLevel: 'priority',
        features: ['Premium games', 'Video chat', 'High prizes']
      },
      platinum: {
        bingoAccess: false,
        maxCredits: 5000,
        supportLevel: 'vip',
        features: ['VIP games', 'Private rooms', 'Exclusive prizes']
      },
      diamond: {
        bingoAccess: true,
        maxCredits: 25000,
        supportLevel: 'concierge',
        features: ['Diamond bingo', 'Exclusive tournaments', 'Premium prizes', 'Personal concierge']
      }
    };

    return benefits[tier] || benefits.free;
  };

  const formatMembershipTier = (tier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getMembershipColor = (tier) => {
    const colors = {
      free: 'text-gray-400',
      silver: 'text-gray-300',
      gold: 'text-yellow-400',
      platinum: 'text-purple-400',
      diamond: 'text-blue-400'
    };
    return colors[tier] || colors.free;
  };

  const getDiamondLevelBenefits = (level) => {
    const levelBenefits = {
      1: { multiplier: 1.0, extraCards: 1, specialPowers: [] },
      2: { multiplier: 1.1, extraCards: 2, specialPowers: ['Auto Mark'] },
      3: { multiplier: 1.2, extraCards: 3, specialPowers: ['Auto Mark', 'Number Preview'] },
      4: { multiplier: 1.3, extraCards: 4, specialPowers: ['Auto Mark', 'Number Preview', 'Lucky Boost'] },
      5: { multiplier: 1.5, extraCards: 5, specialPowers: ['All Powers', 'Exclusive Games'] }
    };
    return levelBenefits[level] || levelBenefits[1];
  };

  return {
    user,
    setUser,
    hasAccess,
    checkMembershipAccess,
    upgradeMembership,
    getMembershipBenefits,
    formatMembershipTier,
    getMembershipColor,
    getDiamondLevelBenefits
  };
};