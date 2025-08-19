# 🎮 Virtual Dating Games Platform

A premium social gaming platform featuring **Virtual Karaoke**, **Diamond Bingo**, and **VR Paranormal Investigation** games designed to bring people together through immersive experiences.

## 🎯 Games Overview

### 🎤 Virtual Karaoke Room
- **Access**: Free tier and above
- **Players**: Up to 10 per room
- **Features**: Real-time video chat, professional scoring, duet mode
- **Duration**: 60 minutes per session

### 🎱 Diamond Bingo Elite  
- **Access**: Diamond membership required ($29.99/month)
- **Players**: Up to 50 per game
- **Features**: $50K+ prize pools, exclusive power-ups, VIP support
- **Duration**: 30 minutes per game
- **Entry Fee**: 100+ credits

### 👻 VR Paranormal Investigation
- **Access**: Platinum+ membership required ($19.99/month)
- **Players**: 2-6 per investigation team
- **Features**: Full VR immersion, ghost hunting equipment, team communication
- **Duration**: 30 minutes per investigation
- **Entry Fee**: 250+ credits
- **Requirements**: VR headset, 6x6ft play space

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling with custom color scheme (Pink, Black, White, Purple, Gray)
- **Three.js** - 3D graphics for VR scenes
- **Lucide React** - Icon library
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time websockets

### Database & Hosting
- **Firebase Firestore** - NoSQL database
- **Firebase Hosting** - Frontend hosting
- **Firebase Authentication** - User management
- **Firebase Functions** - Serverless backend

## 📁 Project Structure

```
project-root/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── games/
│   │   │   │   ├── karaoke/     # Karaoke components
│   │   │   │   ├── bingo/       # Bingo components  
│   │   │   │   └── vr/          # VR game components
│   │   │   └── ui/              # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   ├── styles/              # CSS files
│   │   ├── data/                # Game data (ghosts, equipment, etc.)
│   │   └── pages/               # Main page components
│   ├── public/
│   └── package.json
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── services/            # Business logic
│   │   └── config/              # Configuration
│   └── package.json
└── README.md
```

## 🚀 Quick Setup

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- VR headset (for VR game testing)

### 1. Clone and Install
```bash
git clone <repository-url>
cd dating-games-platform

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies  
cd ../backend
npm install
```

### 2. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

### 3. Environment Variables

Create `frontend/.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### 4. Start Development Servers
```bash
# Terminal 1 - Frontend
cd frontend
npm start

# Terminal 2 - Backend  
cd backend
npm run dev
```

## 🎮 Game-Specific Setup

### Virtual Karaoke Requirements
- Microphone access
- Camera access (optional)
- Stable internet (5+ Mbps)

### Diamond Bingo Requirements
- Diamond membership verification
- Credit system integration
- Real-time number calling system

### VR Paranormal Requirements
- WebXR compatible browser (Chrome/Edge)
- VR headset (Meta Quest, HTC Vive, etc.)
- 6x6ft minimum play space
- Hand controllers
- High-speed internet (25+ Mbps)

## 🔐 Membership Tiers

| Tier | Price | Games Access | Features |
|------|-------|-------------|----------|
| **Free** | $0 | Karaoke | Basic features, 100 credits max |
| **Silver** | $9.99 | Karaoke | Voice chat, 500 credits max |
| **Gold** | $14.99 | Karaoke | Video chat, 1000 credits max |
| **Platinum** | $19.99 | Karaoke + VR | VR games, 5000 credits max |
| **Diamond** | $29.99 | All Games | Everything + Diamond Bingo, 25000 credits max |

## 🏗️ Database Schema

### Firestore Collections

```javascript
// Users Collection
users: {
  userId: {
    name: string,
    email: string,
    membershipTier: string,
    credits: number,
    avatar: string,
    totalWins: number,
    joinDate: timestamp
  }
}

// Games Collection  
games: {
  gameId: {
    type: string, // 'karaoke', 'bingo', 'vr'
    status: string, // 'lobby', 'active', 'completed'
    participants: array,
    settings: object,
    createdAt: timestamp
  }
}

// Memberships Collection
memberships: {
  userId: {
    tier: string,
    expiryDate: timestamp,
    autoRenew: boolean,
    paymentMethod: string
  }
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Pink (#ec4899), Purple (#8b5cf6)
- **Neutral**: Black (#000000), White (#ffffff), Gray (#6b7280)
- **Game Themes**:
  - Karaoke: Pink to Purple gradient
  - Bingo: Blue to Cyan gradient  
  - VR: Purple to Red gradient

### Component Classes
```css
.btn-primary     /* Pink to purple gradient button */
.btn-karaoke     /* Karaoke-themed button */
.btn-bingo       /* Bingo-themed button */
.btn-vr          /* VR-themed button */
.game-card       /* Game selection card */
.modal-backdrop  /* Modal overlay */
.glass           /* Glassmorphism effect */
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Games
- `GET /api/games/active` - Get active game rooms
- `POST /api/games/create` - Create new game room
- `POST /api/games/join` - Join existing game
- `DELETE /api/games/leave` - Leave current game

### Membership
- `GET /api/membership/status` - Get user membership
- `POST /api/membership/upgrade` - Upgrade membership
- `POST /api/membership/cancel` - Cancel membership

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Firebase Functions)
```bash
cd backend
firebase deploy --only functions
```

### Database Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /games/{gameId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || request.auth.uid in resource.data.participants);
    }
  }
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                # Run unit tests
npm run test:e2e       # Run end-to-end tests
```

### Backend Testing  
```bash
cd backend
npm test               # Run API tests
npm run test:integration # Run integration tests
```

### VR Testing
1. Connect VR headset
2. Open Chrome/Edge browser
3. Navigate to `https://localhost:3000/games/vr`
4. Allow VR permissions
5. Test hand tracking and movement

## 📱 Mobile Support

- **Karaoke**: Full mobile support with touch controls
- **Bingo**: Responsive design for tablets and phones
- **VR**: Requires VR headset, no mobile support

## 🔒 Security Features

- Firebase Authentication
- Membership tier verification
- Anti-cheating measures for games
- Rate limiting on API endpoints
- Secure payment processing
- Content moderation for chat

## 🆘 Troubleshooting

### Common Issues

**VR not working:**
- Check WebXR browser support
- Verify VR headset connection
- Clear browser cache
- Check HTTPS connection

**Audio issues in Karaoke:**
- Allow microphone permissions
- Check audio device settings
- Test with different browsers
- Restart audio devices

**Membership verification failing:**
- Check payment method
- Verify email confirmation
- Contact support for manual verification

## 📞 Support

For technical support or membership issues:
- Email: support@datinggames.com
- Discord: Join our community server
- Documentation: Visit our help center

## 📄 License

Proprietary - All rights reserved

---

**Ready to bring people together through gaming? Start your development journey now!** 🚀