# Navigate - Adaptive Learning Platform

## Overview

Navigate is a comprehensive adaptive learning platform designed to enhance the educational experience for both instructors and students. The platform leverages AI technology to provide personalized learning paths, automated assessment generation, syllabus analysis, and plagiarism detection.

## Features

- **Adaptive Learning Engine:** Personalizes educational content based on individual student performance and learning patterns
- **Syllabus Analysis:** Automatically extracts key information from uploaded syllabi to streamline course setup
- **Assessment Generation & Evaluation:** Creates varied assessment patterns with automated evaluation capabilities
- **Plagiarism Detection:** Ensures academic integrity through sophisticated plagiarism checks
- **Expert Panel Integration:** Provides access to expert knowledge and guidance
- **Curriculum Mapping:** Helps instructors align course content with learning objectives

## Project Structure

### Backend

The backend is built with Node.js and provides RESTful APIs for all platform functionalities.

```
backend/
├── server.js                 # Main server file
├── api/                      # API route definitions
├── controllers/              # Business logic controllers
├── middlewares/              # Custom middleware (authentication, etc.)
├── models/                   # Database models
├── services/                 # Service layer for business logic
└── uploads/                  # File upload storage
```

### Frontend

The frontend is built with React and provides separate interfaces for instructors and students.

```
frontend/
├── public/                   # Static assets
└── src/
    ├── components/           # Reusable UI components
    ├── contexts/             # React contexts for state management
    ├── pages/                # Page components for different routes
    ├── services/             # API service integrations
    └── styles/               # CSS and styling files
```

### AI Services

Specialized AI services that power the platform's intelligent features.

```
ai_services/
├── adaptive_learning/        # Personalized learning path algorithms
├── assessment/               # Question generation and evaluation
├── expert_panel/             # Expert knowledge integration
├── models/                   # AI model implementations
└── plagiarism/               # Plagiarism detection algorithms
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-organization/Navigate.git
cd Navigate
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Install AI services dependencies:
```bash
cd ../ai_services
npm install
```

### Configuration

1. Create `.env` files in both backend and ai_services directories with appropriate configuration:

Backend `.env` example:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/navigate
JWT_SECRET=your_jwt_secret
```

AI Services `.env` example:
```
MODEL_PATH=./models/local
API_KEY=your_api_key_if_using_external_services
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Start the AI services:
```bash
cd ai_services
npm run start
```

#### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

## Usage

### For Instructors

1. Register and log in to your instructor account
2. Upload your course syllabus for automatic analysis
3. Create and manage courses
4. Generate assessments using the Quick Quiz Generator
5. View detailed student results and analytics

### For Students

1. Register and log in to your student account
2. Access your personalized learning dashboard
3. View assigned courses and assessments
4. Take adaptive assessments
5. View your results and personalized learning recommendations

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape Navigate
- Special thanks to [Your University/Organization] for supporting this capstone project