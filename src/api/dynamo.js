// src/api/dynamo.js
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { awsRegion, accessKeyId, secretAccessKey, dynamoTableName } from "../aws-config";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB({
  region: awsRegion,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const docClient = DynamoDBDocument.from(dynamoDb);

export async function addUserEntry({ name, email, strengths, weaknesses }) {
  const userId = uuidv4();
  const code = uuidv4().split("-")[0]; // Simple unique code generation
  const params = {
    TableName: dynamoTableName,
    Item: {
      userId,
      code,
      name,
      email,
      strengths: strengths || "",
      weaknesses: weaknesses || "",
      timestamp: new Date().toISOString(),
    },
  };
  
  console.log("Adding entry to DynamoDB:", params.Item);
  try {
    await docClient.put(params);
    console.log("Successfully added entry to DynamoDB");
    return { userId, code };
  } catch (error) {
    console.error("DynamoDB put error:", error);
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function getUserEntry(userId, code) {
  const params = {
    TableName: dynamoTableName,
    Key: { userId },
  };
  const result = await docClient.get(params);
  if (result.Item && result.Item.code === code) {
    return result.Item;
  } else {
    throw new Error("Entry not found or code mismatch");
  }
}

export async function listAllEntries() {
  const params = { TableName: dynamoTableName };
  const result = await docClient.scan(params);
  return result.Items;
}
