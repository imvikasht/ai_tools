# AI Multi-Tool Web Platform

AI Multi-Tool Web Platform is a full-stack premium SaaS-style web application. It combines AI generators, academic utilities, business calculators, productivity helpers, dashboard analytics, saved tools, and local history into a clean, scalable architecture without login or database setup.

## 1. Folder Structure

```text
ai-multi-tool-platform/
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- data/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- styles/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- package.json
`-- README.md
```

## 2. Step-by-Step Implementation

1. Created a monorepo-style project structure with separate `frontend` and `backend` workspaces.
2. Built an Express backend with modular routes, controllers, services, and middleware.
3. Removed authentication and database dependency so the platform opens instantly for demos.
4. Created a scalable tool catalog with 24 tools across AI, Student, Business, Utility, and Productivity categories.
5. Built a tool execution engine that supports formula tools, calculators, converters, generators, and AI-backed tools.
6. Added browser-based persistence so every tool run stores input, output, tool info, and timestamps in local storage.
7. Added dashboard analytics for recent activity, top tools, usage stats, and saved tool count using local data.
8. Built a modern React frontend with landing page, dashboard, tool studio, and history screens.
9. Styled the UI with Tailwind CSS using glassmorphism, dark mode, and responsive layouts for demo appeal.
10. Integrated an AI service layer that uses OpenAI if configured and automatically falls back to mock AI responses.

## 3. Module Explanation

### Frontend Modules

- `api/`: Axios client and public tool API methods.
- `components/layout/`: App shell with sidebar navigation and theme toggle.
- `components/tools/`: Reusable cards, stats, workbench, and history item rendering.
- `context/`: Theme context for global state.
- `pages/`: Home, dashboard, tools, and history screens.
- `data/toolTemplates.js`: Starter input payloads for different tools.
- `utils/localData.js`: Local storage helpers for saved tools and history.

### Backend Modules

- `controllers/`: Business logic for public tool endpoints.
- `services/aiService.js`: AI abstraction layer for mock or live OpenAI generation.
- `services/toolService.js`: Execution engine for calculators, planners, converters, and AI tools.
- `middleware/`: Centralized error handling.
- `data/tools.js`: Central tool registry used by the UI and APIs.

## 4. Main Features Implemented

- Multi-tool catalog with 24 ready-to-use tools
- Categories for Student, Business, AI, Utility, and Productivity
- AI integration with mock and real API support
- No-login access for all tools
- User dashboard with recent activity and usage summary
- Saved tools feature with browser persistence
- Tool execution history with browser persistence
- Copy and download output support
- Dark mode support
- Responsive premium UI
- Error handling and loading states

## 5. Environment Setup

Create `backend/.env` using this template:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

## 6. How to Run

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`

## 7. Viva Explanation Points

- The project follows clear separation of concerns using frontend and backend workspaces.
- The backend uses controller-service architecture, which is easy to explain in viva.
- The tool engine is scalable because new tools can be added from a central catalog and execution map.
- AI features are abstracted into a separate service, so switching providers is easy.
- User history and saved tools demonstrate real-world product behavior without requiring user accounts.
- The UI is polished enough for live demo and practical deployment discussion.
