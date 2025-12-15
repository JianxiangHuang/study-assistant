# AI-Powered Study Assistant

A full-stack web application that helps students learn more effectively by using AI to analyze study materials, extract key concepts, and generate interactive flashcards.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **AI-Powered Analysis** - Uses OpenAI API to extract keywords and concepts from study materials
- **Interactive Keyword Highlighting** - Click on highlighted terms to see explanations
- **Smart Flashcard Generation** - Automatically creates flashcards from analyzed content
- **3D Flip Card Animation** - Engaging flashcard review experience with smooth animations
- **Progress Tracking** - Track mastered cards during study sessions

## 📋 Requirements Met

### ReactJS (Frontend)
- ✅ OAuth login (Google Authentication)
- ✅ Advanced React features:
  - `useReducer` - State management in StudyContext
  - `useEffect` - Side effects and data fetching
  - `Context API` - AuthContext and StudyContext for global state
- ✅ External API integration (OpenAI API)
- ✅ Interactive UI (keyword tooltips, clickable elements)
- ✅ Third-party library (Lucide React icons, Axios)
- ✅ CSS Animation (3D flip card animation)

### Express (Backend)
- ✅ RESTful API with Express.js
- ✅ Full CRUD operations (study materials, flashcards)
- ✅ SQLite database with Drizzle ORM
- ✅ Data validation with Zod schemas
- ✅ Session management with express-session

### Other Requirements
- ✅ Dev Container configuration for VS Code
- ✅ Playwright test setup
- ✅ Clean project structure

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Lucide React (icons)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- Passport.js (Google OAuth)
- SQLite with better-sqlite3
- Drizzle ORM
- OpenAI API
- Zod (validation)

## 📁 Project Structure

```
study-assistant/
├── .devcontainer/
│   └── devcontainer.json      # VS Code dev container config
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers (Auth, Study)
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind CSS
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/            # Passport configuration
│   │   ├── db/                # Database schema and connection
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (OpenAI)
│   │   └── index.js           # Server entry point
│   ├── .env.example           # Environment variables template
│   └── package.json
├── tests/                      # Playwright tests
│   └── login.spec.js
├── playwright.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console project (for OAuth)
- OpenAI API key

### 1. Clone and Setup

```bash
# Navigate to project
cd study-assistant

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key-here

# Client URL
CLIENT_URL=http://localhost:5173

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure consent screen
6. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 4. Run the Application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🧪 Running Tests

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npx playwright test

# Run tests with UI
npx playwright test --ui
```

## 📝 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### Study Materials
- `POST /api/study-materials` - Create study material
- `GET /api/study-materials` - Get all user's materials
- `GET /api/study-materials/:id` - Get single material
- `PUT /api/study-materials/:id` - Update material
- `DELETE /api/study-materials/:id` - Delete material

### Flashcards
- `POST /api/flashcards/generate` - Generate flashcards from keywords
- `POST /api/flashcards` - Create single flashcard
- `GET /api/flashcards` - Get all user's flashcards
- `PATCH /api/flashcards/:id/mastered` - Toggle mastered status
- `DELETE /api/flashcards/:id` - Delete flashcard

### Analysis
- `POST /api/analyze` - Analyze content and extract keywords

## 🎨 Key Components

### AuthContext
Manages authentication state using Context API.

### StudyContext
Uses `useReducer` for complex state management of study flow.

### Flashcard Component
Features CSS 3D transform animation for flip effect.

### KeywordHighlight
Highlights keywords in text with interactive tooltips.

## 📄 License

MIT License

## 🙏 Attribution

- [OpenAI](https://openai.com/) - AI text analysis
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [Vite](https://vitejs.dev/) - Build tool
