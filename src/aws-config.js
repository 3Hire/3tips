// Log environment variable loading (but not the actual values for security)
console.log("AWS Config Loading: Environment variables check");
console.log("REACT_APP_AWS_REGION present:", !!process.env.REACT_APP_AWS_REGION);
console.log("REACT_APP_AWS_ACCESS_KEY_ID present:", !!process.env.REACT_APP_AWS_ACCESS_KEY_ID);
console.log("REACT_APP_AWS_SECRET_ACCESS_KEY present:", !!process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
console.log("REACT_APP_DYNAMODB_TABLE present:", !!process.env.REACT_APP_DYNAMODB_TABLE);

export const awsRegion = process.env.REACT_APP_AWS_REGION;
export const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const dynamoTableName = process.env.REACT_APP_DYNAMODB_TABLE;

// Validate AWS configuration
if (!awsRegion || !accessKeyId || !secretAccessKey || !dynamoTableName) {
  console.error("Missing required AWS configuration environment variables");
}

console.log("Using DynamoDB table:", dynamoTableName);
console.log("Using AWS region:", awsRegion);
