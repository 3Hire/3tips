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

export async function addUserEntry({ name, email, strengths, weaknesses, userId = null }) {
  // If userId is provided, it's an update operation, otherwise create new
  const newUserId = userId || uuidv4().substring(0, 8);
  const code = uuidv4().split("-")[0]; // Simple unique code generation
  const params = {
    TableName: dynamoTableName,
    Item: {
      userId: newUserId,
      code: userId ? code : code, // Keep existing code if updating
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
    return { userId: newUserId, code };
  } catch (error) {
    console.error("DynamoDB put error:", error);
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function updateUserEntry(userId, { name, email, strengths, weaknesses }) {
  // Get the existing entry first to preserve the code
  const existingEntry = await getUserEntry(userId);
  
  return await addUserEntry({
    userId,
    name,
    email,
    strengths,
    weaknesses,
    code: existingEntry.code
  });
}

export async function getUserEntry(userId, code = null) {
  const params = {
    TableName: dynamoTableName,
    Key: { userId },
  };
  const result = await docClient.get(params);
  if (!result.Item) {
    throw new Error("Entry not found");
  }
  
  // If code is provided, verify it matches
  if (code && result.Item.code !== code) {
    throw new Error("Code mismatch");
  }
  
  return result.Item;
}

export async function listAllEntries() {
  const params = { TableName: dynamoTableName };
  const result = await docClient.scan(params);
  return result.Items;
}
