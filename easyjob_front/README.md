# EasyJob Frontend

A modern job board platform built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Register and login for job seekers and employers
- **Job Listings**: Browse and search for jobs with advanced filtering
- **Company Profiles**: View detailed company information and open positions
- **Application Management**: Apply for jobs and track application status
- **Employer Dashboard**: Post jobs, review applications, and manage company profiles
- **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API, React Query
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- Backend API running (see easyjob_backend directory)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd easyjob/easyjob_front
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## Project Structure

```
├── public/              # Static files
├── src/
│   ├── api/             # API service functions
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Connecting to the Backend

This frontend is designed to work with the EasyJob backend API. Make sure the backend server is running on `http://localhost:8000` before using the frontend app.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
