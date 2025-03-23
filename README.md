# 3Hire Website

A web application for managing candidate profiles with AWS DynamoDB integration.

## Project Structure

```
reactive-website/
│
├── index.html               # Home page
├── admin.html               # Candidate management page
├── styles.css               # Shared styles
├── admin.css                # Admin-specific styles
├── app.js                   # Home page functionality
├── admin.js                 # Candidate management functionality
├── amplify.yml              # AWS Amplify configuration
│
└── backend/                 # Node.js + Express backend
    ├── server.js            # Main server file
    ├── .env                 # Environment variables
    ├── package.json         # Backend dependencies
    ├── config/              # Configuration files
    │   └── dynamodb.js      # DynamoDB configuration
    ├── models/              # Database models
    │   └── Candidate.js     # Candidate operations
    ├── routes/              # API routes
    │   ├── candidates.js    # Candidate CRUD endpoints
    │   └── contact.js       # Contact form handling
    └── scripts/             # Utility scripts
        └── create-dynamo-tables.js  # DynamoDB setup
```

## Architecture
- Frontend: Static HTML, CSS and JavaScript 
- Backend: Node.js with Express
- Database: AWS DynamoDB

## AWS Amplify Deployment
This project is configured to deploy to AWS Amplify using GitHub integration.

### Environment Variables
The following environment variables should be configured in the Amplify Console:

- `NODE_ENV`: Set to `production` for production deployment
- `DYNAMODB_CANDIDATES_TABLE`: DynamoDB table name (default: `Candidates`)
- `EMAIL_USER`: Email account for sending notifications
- `EMAIL_PASS`: Password for email account
- `AWS_REGION`: AWS region for DynamoDB (default: `us-east-1`)

### IAM Permissions
The Amplify app needs the following IAM permissions to access DynamoDB:
- `dynamodb:CreateTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`
- `dynamodb:Scan`
- `dynamodb:Query`

## Local Development

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd backend
   npm install
   ```
3. Create a `.env` file in the backend directory with the required environment variables
4. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
5. Open `index.html` in your browser

### Database Setup
For local development, you can use AWS DynamoDB local or connect to the AWS cloud instance.
Run the table creation script:
```
cd backend
npm run create-tables
```

## API Endpoints

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `GET /api/candidates/search?q=query` - Search candidates
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate
- `POST /api/contact` - Submit contact form