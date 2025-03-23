# Deploying the Backend to AWS

This document provides instructions for deploying the backend to AWS Elastic Beanstalk.

## Prerequisites

1. **AWS CLI**: Make sure you have the AWS CLI installed and configured
2. **AWS Elastic Beanstalk CLI**: Install the EB CLI
3. **AWS Credentials**: Configure your AWS credentials

## Setting up DynamoDB

1. Create the DynamoDB table by running:

```bash
cd /Users/j3hire/reactive-website/backend
npm run create-tables
```

Alternatively, you can create the table manually in the AWS Console:
- Go to AWS Console > DynamoDB
- Create a table named "Candidates" (or your custom name set in .env)
- Set the primary key to "pk" (String)
- Configure read/write capacity as needed

## Deploying with Elastic Beanstalk

1. Initialize EB in your backend directory:

```bash
cd /Users/j3hire/reactive-website/backend
eb init
```

Follow the prompts:
- Select your AWS region
- Create a new application or select existing one
- Select Node.js as the platform
- Choose whether to use CodeCommit
- Set up SSH for instance access if needed

2. Create an environment:

```bash
eb create
```

3. Deploy your application:

```bash
eb deploy
```

4. Open your deployed application:

```bash
eb open
```

## Setting Environment Variables

You'll need to set environment variables for your EB environment:

1. Go to AWS Console > Elastic Beanstalk > Your Environment
2. Click on "Configuration" 
3. In "Software" section, click "Edit"
4. Add the following environment variables:
   - `NODE_ENV=production`
   - `DYNAMODB_CANDIDATES_TABLE=Candidates`
   - `EMAIL_USER=your_email_user`
   - `EMAIL_PASS=your_email_password` (use AWS Parameter Store for sensitive values)

5. Save the changes

## IAM Permissions

Your Elastic Beanstalk environment needs IAM permissions to access DynamoDB. Create an IAM policy with:

- DynamoDB:CreateTable
- DynamoDB:PutItem
- DynamoDB:GetItem
- DynamoDB:UpdateItem
- DynamoDB:DeleteItem
- DynamoDB:Scan
- DynamoDB:Query

Attach this policy to the IAM role used by your Elastic Beanstalk environment.

## Updating Frontend

Once your backend is deployed, update your frontend code to point to the new API endpoint:

1. Modify `/Users/j3hire/reactive-website/admin.js` to use your Elastic Beanstalk URL:

```javascript
const getApiBaseUrl = () => {
  // Use the Elastic Beanstalk URL
  return 'https://your-environment-name.elasticbeanstalk.com/api';
};
```

2. Deploy your frontend to AWS Amplify or your preferred hosting service.

## Troubleshooting

- **CORS Issues**: Make sure your CORS settings allow requests from your frontend domain
- **DynamoDB Access**: Check IAM permissions if you see access denied errors
- **Logs**: Check EB logs for any server errors (`eb logs`)
- **Connectivity**: Make sure your security groups allow necessary traffic