# Heal+ 

A comprehensive medical dashboard system built with Next.js and FastAPI, featuring health metrics analysis and ML-based disease prediction.

## System Architecture

The project consists of two main components:
- Frontend: Next.js application with modern UI components
- Backend: FastAPI service with ML-powered health analysis

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Radix UI Components
- Recharts
- AWS S3/Cloudflare R2
- Groq AI Integration

### Backend
- FastAPI
- Python
- Scikit-learn
- Pandas
- NumPy
- Pydantic

## Prerequisites

- Node.js 18+ 
- Python 3.8+
- npm or yarn
- pip

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file with:
```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_ACCOUNT_ID=
GROQ_API_KEY=
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

Open [http://localhost:8000](http://localhost:8000) to view the API documentation.

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests

## Project Structure

```
frontend/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/          # Utility libraries
├── utils/        # Helper functions
├── public/       # Static assets
└── types/        # TypeScript type definitions

backend/
├── app/           # FastAPI app modules
├── models/        # Data models and schemas
├── services/      # Business logic and services
├── tests/         # Test cases
└── main.py        # Entry point for the FastAPI app
```

## Features

- Authentication with NextAuth.js
- Modern UI with Tailwind CSS and Radix UI
- Data visualization with Recharts
- File uploads to Cloudflare R2
- AI integration with Groq
- Responsive design
- Dark mode support
- ML-based health metrics analysis
- Disease prediction using Scikit-learn

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
