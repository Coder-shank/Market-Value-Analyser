# Market Value Analyzer

Market Value Analyzer is an AI-powered career intelligence platform that analyzes user skills, market demand, salary trends, and location preferences to generate personalized career insights and career roadmaps.

## Features

- AI-powered career and salary analysis
- Personalized city recommendations
- Resume score analysis system
- Skill reality check and market comparison
- Career roadmap prediction
- Dynamic AI prompt generation
- Responsive frontend UI
- Full-stack deployment support

## Tech Stack

Frontend:
- React.js
- JavaScript
- CSS

Backend:
- Node.js
- Express.js

API & Services:
- OpenRouter API
- GPT OSS Model

Deployment:
- Render

## Project Structure

market-value-analyser/

frontend/
- src/
  - Home.jsx
  - App.jsx
  - main.jsx
  - styles.css

backend/
- server.js
- .env

README.md

## Installation and Setup

Clone the repository:

git clone <repository-url>

cd market-value-analyser

## Frontend Setup

cd frontend

npm install

npm run dev

Frontend runs on:
http://localhost:5173

## Backend Setup

cd backend

npm install

Create a .env file and add:

OPENROUTER_API_KEY=your_api_key_here

Run the backend server:

node server.js

Backend runs on:
http://localhost:5000

## API Endpoint

POST /generate

Sample Request Body:

{
  "userInput": "React, Node.js, DSA",
  "preference": {
    "climate": "moderate",
    "budget": "medium",
    "transport": "good",
    "distance": "near",
    "cityType": "metro",
    "workMode": "hybrid"
  },
  "years": "10",
  "analyzeFactors": true,
  "analyzeSkills": true
}

## Functional Modules

1. Market Analysis
- Average salary analysis
- Salary range prediction
- Demand score
- Best role suggestions
- Best city recommendations

2. Location Intelligence
- Cost of living analysis
- PG rent estimation
- Transport evaluation
- Pollution score
- Distance from hometown analysis

3. Resume Score System
- Projects evaluation
- Certificates analysis
- Internship impact
- College brand value
- Communication skills evaluation

4. Skill Reality Check
- DSA-focused candidates
- Fast execution developers
- AI/Data-focused profiles
- Multi-skill low-depth profiles

## Key Learnings

- Dynamic Prompt Engineering
- AI API Integration
- Conditional Rendering in React
- State Management using Hooks
- REST API Development
- Full Stack Deployment
- Personalized Recommendation Systems

## Future Improvements

- Authentication system
- PDF report generation
- Graphs and charts
- User dashboard
- Analysis history
- Real-time job API integration
- Resume upload and parsing

## Author

Shashank Shekhar Pandey
