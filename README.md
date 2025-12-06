# PaperPal – AI Study Buddy

## Overview
PaperPal is a full-stack web app that allows users to upload PDFs, extract text, generate AI summaries and practice questions, and read notes aloud using text-to-speech. It also supports user authentication and study session management.

## Features
- User authentication (signup/login)
- Create and manage study sessions
- Upload PDFs and extract text
- AI-powered summaries and question generation
- Text-to-speech playback for notes
- Realtime collaboration (optional)
- Dashboard with session tracking

## Tech Stack
- Frontend: React, Next.js, TailwindCSS
- Backend: Supabase Functions or Node.js + Express
- Database: Supabase 
- AI: OpenAI GPT-4 for summarization and questions
- PDF Parsing: pdf-parse
- Hosting: Vercel (frontend), Supabase (backend/storage)

## Folder Structure
paperpal/
├─ public/
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ services/
│ ├─ context/
│ ├─ utils/
│ └─ styles/
├─ .env.local
├─ package.json
└─ tailwind.config.js