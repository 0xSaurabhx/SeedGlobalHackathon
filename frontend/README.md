# Heal+

A modern medical dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Radix UI Components
- Recharts
- AWS S3/Cloudflare R2
- Groq AI Integration

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
I'll help you create a comprehensive README.md file for the frontend directory. Based on the project structure and files shown, it appears to be a Next.js application with Tailwind CSS, authentication, and various integrations.

### [README.md](file:///home/saurabh/Downloads/MedicalDashboard/frontend/README.md)

Here's the content for the README file:

```markdown


# Medical Dashboard Frontend

A modern medical dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Radix UI Components
- Recharts
- AWS S3/Cloudflare R2
- Groq AI Integration

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

1. Clone the repository
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
```

## Features

- Authentication with NextAuth.js
- Modern UI with Tailwind CSS and Radix UI
- Data visualization with Recharts
- File uploads to Cloudflare R2
- AI integration with Groq
- Responsive design
- Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
