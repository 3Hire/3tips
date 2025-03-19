# Candidate Profile Management System

A web application for managing candidate profiles with MongoDB database integration.

## Project Structure

```
reactive-website/
│
├── index.html                # Home page
├── admin.html               # Candidate management page
├── styles.css               # Shared styles
├── admin.css                # Admin-specific styles
├── app.js                   # Home page functionality
├── admin.js                 # Candidate management functionality
│
└── backend/                  # Node.js + Express backend
    ├── server.js             # Main server file
    ├── .env                  # Environment variables
    ├── package.json          # Backend dependencies
    ├── models/               # Mongoose models
    │   └── Candidate.js      # Candidate schema
    └── routes/               # API routes
        └── candidates.js     # Candidate CRUD endpoints
```

## Setup Instructions

### Prerequisites

- Node.js and npm
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB:
   ```
   mongod
   ```

4. Start the backend server:
   ```
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

### Frontend Usage

1. Open `index.html` in your browser to access the home page
2. Click on the "Candidates" link in the navigation bar to access the candidate management page
3. Use the management page to:
   - Create new candidate profiles
   - Search for existing candidates by ID
   - Update candidate information
   - Delete candidate profiles

## API Endpoints

- `GET /api/candidates` - Get all candidates (list view)
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate