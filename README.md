# HandNote AI

```text
  _   _                 _ _   _       _         _    ___ 
 | | | | __ _ _ __   __| | \ | | ___ | |_ ___  / \  |_ _|
 | |_| |/ _` | '_ \ / _` |  \| |/ _ \| __/ _ \/ _ \  | | 
 |  _  | (_| | | | | (_| | |\  | (_) | ||  __/ ___ \ | | 
 |_| |_|\__,_|_| |_|\__,_|_| \_|\___/ \__\___/_/   \_\___|
```

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

## Project Overview
HandNote AI allows students to upload assignment questions (PDF, DOCX, or images). The system extracts the questions using OCR, sends them to OpenAI for answer generation, and renders the answers onto realistic handwritten notebook-style pages. The final output is a downloadable PDF.

## Features
- OCR for extracting text from assignments
- AI-powered answer generation via OpenAI
- Realistic handwritten rendering
- Custom handwriting profiles
- Downloadable PDF exports
- Subscription and credit management

## Prerequisites
- Node.js 18+
- MongoDB
- npm 9+
- OpenAI API Key

## Installation
1. Clone the repository
2. Run `npm install` in the root to install all monorepo dependencies.

## Environment Setup
1. Copy `.env.example` to `.env` in the root.
2. Copy `client/.env.local.example` to `client/.env.local` and fill in values.
3. Copy `server/.env.example` to `server/.env` and fill in values.

## Running Dev Servers
Run the following command from the root directory to start both client (localhost:3000) and server (localhost:5000):
```bash
npm run dev
```

## Project Structure
- `/client`: Next.js frontend
- `/server`: Node.js Express backend

## API Documentation
API docs will be available at `http://localhost:5000/api/docs` (Swagger placeholder).

## Contributing
Please read CONTRIBUTING.md (placeholder) for details on our code of conduct, and the process for submitting pull requests to us.

## License
MIT License
