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
      agreementSigned: false // Default to false for new entries
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
  // Get the existing entry first to preserve all fields
  const existingEntry = await getUserEntry(userId);
  
  const params = {
    TableName: dynamoTableName,
    Key: { userId },
    UpdateExpression: "SET #name = :name, #email = :email, #strengths = :strengths, #weaknesses = :weaknesses",
    ExpressionAttributeNames: {
      "#name": "name",
      "#email": "email",
      "#strengths": "strengths",
      "#weaknesses": "weaknesses"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":email": email,
      ":strengths": strengths || "",
      ":weaknesses": weaknesses || ""
    },
    ReturnValues: "ALL_NEW"
  };
  
  try {
    const result = await docClient.update(params);
    console.log("Successfully updated entry in DynamoDB");
    return result.Attributes;
  } catch (error) {
    console.error("DynamoDB update error:", error);
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function getUserEntry(userId, code = null) {
  const params = {
    TableName: dynamoTableName,
    Key: { userId },
  };
  const result = await docClient.get(params);
  if (!result.Item) {
    throw new Error("Candidate not found");
  }
  
  // If code is provided, verify it matches
  if (code && result.Item.code !== code) {
    throw new Error("Access Code mismatch");
  }
  
  return result.Item;
}

export async function listAllEntries() {
  const params = { TableName: dynamoTableName };
  const result = await docClient.scan(params);
  return result.Items;
}

export async function updateAgreementStatus(userId, signed = true) {
  const params = {
    TableName: dynamoTableName,
    Key: { userId },
    UpdateExpression: "SET agreementSigned = :signed",
    ExpressionAttributeValues: {
      ":signed": signed
    },
    ReturnValues: "ALL_NEW"
  };
  
  try {
    const result = await docClient.update(params);
    console.log("Successfully updated agreement status in DynamoDB");
    return result.Attributes;
  } catch (error) {
    console.error("DynamoDB update agreement status error:", error);
    throw new Error(`Database error: ${error.message}`);
  }
}
