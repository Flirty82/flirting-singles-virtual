// frontend/src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  GAMES: 'games',
  KARAOKE_ROOMS: 'karaokeRooms',
  BINGO_GAMES: 'bingoGames',
  VR_SESSIONS: 'vrSessions',
  MEMBERSHIPS: 'memberships',
  TRANSACTIONS: 'transactions',
  LEADERBOARDS: 'leaderboards'
};

// Game room configuration
export const GAME_CONFIG = {
  KARAOKE: {
    MAX_PARTICIPANTS: 10,
    SESSION_DURATION: 3600, // 1 hour
    REQUIRED_TIER: 'free',
    ENTRY_FEE: 0
  },
  BINGO: {
    MAX_PARTICIPANTS: 50,
    SESSION_DURATION: 1800, // 30 minutes
    REQUIRED_TIER: 'diamond',
    ENTRY_FEE: 100,
    PRIZE_POOL: 50000
  },
  VR_PARANORMAL: {
    MAX_PARTICIPANTS: 6,
    SESSION_DURATION: 1800, // 30 minutes
    REQUIRED_TIER: 'platinum',
    ENTRY_FEE: 250,
    PRIZE_POOL: 15000
  }
};

// Membership tiers and pricing
export const MEMBERSHIP_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: $0,
    period: 'monthly',
    color: 'gray',
    features: {
      profileViews: 5,
      likes: 3,
      messages: 'unlimited',
      chatRooms: ['general'],
      games: ['basic_games'],
      photoUploads: 'unlimited',
      advancedFilters: false,
      readReceipts: false,
      prioritySupport: true,
      verification: true
    },
    limitations: {
      dailyLikes: 3,
      monthlyMatches: 10,
      storageGB: 0.1
    }
  },
  GOLD: {
    id: 'gold',
    name: 'Gold',
    price: $25,
    period: monthly,
    color: 'yellow',
    features: {
      profileViews: 50,
      likes: 25,
      chatRooms: ['general', 'gold_lounge'],
      games: ['basic_games'],
      photoUploads: 'unlimited',
      videoUploads: 'unlimited',
      videoProfiles: 'true',
      advancedFilters: 'true',
      readReceipts: true,
      verification: true
    },
    limitations: {
      dailyLikes: 25,
      monthlyMatches: 100,
      storageGB: 1
    }
  },
  PLATINUM: {
    id: 'platinum',
    name: 'Platinum',
    price: $35,
    period: 'monthly',
    color: 'purple',
    features: {
      profileViews: 200,
      likes: 100,
      chatRooms: 'unlimited',
      games: ['basic_games', 'bingo'],
      music: 'unlimited',
      advancedFilters: true,
      readReceipts: true,
      verification: true,
    },
    limitations: {
      dailyLikes: 100,
      monthlyMatches: 500,
      storageGB: 5
    }
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamond',
    price: $55,
    period: 'monthly',
    color: 'blue',
    features: {
      profileViews: 'unlimited',
      likes: 'unlimited',
      chatRooms: ['all'],
      games: ['all'],
      vrAccess: true,
      exclusiveEventes: true,
      personalConcierge: true
    },
    limitations: {
      dailyLikes: 'unlimited',
      dailyMessages: 'unlimited',
      monthlyMatches: 'unlimited',
      storageGB: 50
    }
  }
};

// Chat room configuration
export const CHAT_ROOMS = {
  general: {
    id: 'general',
    name: 'General Chat',
    description: 'Welcome to Flirting Singles',
    requiredTier: 'free',
    maxUsers: 100,
    color: gray
  },
  gold_lounge: {
    id: 'gold_lounge',
    name: 'Gold Lounge',
    description: 'Exclusive chat for Gold+ members',
    requiredTier: 'gold',
    maxUsers: 50,
    color: 'yellow'
  },
  platinum_elite: {
    id: 'platinum_elite',
    name: 'Platinum Elite',
    description: 'Premium dicussions for Platinum members',
    requiredTier: 'platinum',
    maxUsers: 25,
    color: 'purple'
  },
  diamond_sactuary: {
    id: 'diamond_sanctuary',
    name: 'Diamond Sanctuary',
    description: 'Ultra-exclusive Diamond members only',
    requiredTier: 'diamond',
    maxUsers: 10,
    color: 'blue'
  },
  vr_lounge: {
    id: 'vr_lounge',
    name: 'VR Lounge',
    description: 'Discuss VR experiences and plan sessions',
    requiredTier: 'platinum',
    maxUsers: 30,
    color: 'purple'
  }
};

// Profile configuration
  

export default app;