# AI Healthcare Bot System

A modern, production-ready full-stack application providing intelligent healthcare assistance, appointment booking, medicine reminders, symptom checking, and more.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion, React Router, Recharts, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt

## Features
- **Premium UI/UX**: Glassmorphism, animations, dark/light mode
- **User Dashboard**: Health summary and quick access
- **AI Chatbot**: Talk to an AI about symptoms, diet, and wellness
- **Symptom Checker**: Instant advice based on symptoms
- **Reminders**: Manage daily medicine intake
- **Appointments**: Book doctor appointments
- **Emergency Hub**: SOS features and nearby hospital placeholders
- **Admin Panel**: Manage users and view analytics

## Project Structure
- `frontend/`: React application (Vite)
- `backend/`: Node.js API server

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your variables:
   ```bash
   cp .env.example .env
   ```
4. Start the server (development):
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Deployment
- **Frontend**: Ready to be deployed on Vercel or Netlify. Just connect your GitHub repo and set the build command to `npm run build` and output directory to `dist`.
- **Backend**: Ready to be deployed on Render, Railway, or Heroku. Make sure to set the environment variables in the hosting provider's dashboard.

## Security
- Passwords hashed with bcrypt
- API protected by JWT authentication
- Role-based access control for Admin dashboard
