const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Configure DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  // If running locally for development, you can use local credentials
  ...(process.env.NODE_ENV === 'development' && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  })
});

// Create document client for easier interaction
const documentClient = DynamoDBDocumentClient.from(client);

// Table names
const TABLES = {
  CANDIDATES: process.env.DYNAMODB_CANDIDATES_TABLE || 'Candidates'
};

// Utility functions for database operations
async function getItem(tableName, key) {
  const command = new GetCommand({
    TableName: tableName,
    Key: key
  });
  
  const response = await documentClient.send(command);
  return response.Item;
}

async function putItem(tableName, item) {
  const command = new PutCommand({
    TableName: tableName,
    Item: item
  });
  
  return documentClient.send(command);
}

async function updateItem(tableName, key, updateExpression, expressionAttributeValues, expressionAttributeNames) {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW'
  });
  
  const response = await documentClient.send(command);
  return response.Attributes;
}

async function deleteItem(tableName, key) {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key
  });
  
  return documentClient.send(command);
}

async function scanItems(tableName, filterExpression = null, expressionAttributeValues = null) {
  const params = {
    TableName: tableName
  };
  
  if (filterExpression) {
    params.FilterExpression = filterExpression;
    params.ExpressionAttributeValues = expressionAttributeValues;
  }
  
  const command = new ScanCommand(params);
  const response = await documentClient.send(command);
  return response.Items;
}

async function queryItems(tableName, keyConditionExpression, expressionAttributeValues, indexName = null) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues
  };
  
  if (indexName) {
    params.IndexName = indexName;
  }
  
  const command = new QueryCommand(params);
  const response = await documentClient.send(command);
  return response.Items;
}

module.exports = {
  documentClient,
  TABLES,
  getItem,
  putItem,
  updateItem,
  deleteItem,
  scanItems,
  queryItems
};