require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

// Configure AWS
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.NODE_ENV === 'development' && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  })
});

// Table name (from env or default)
const CANDIDATES_TABLE = process.env.DYNAMODB_CANDIDATES_TABLE || 'Candidates';

// Create Candidates table
async function createCandidatesTable() {
  // First check if table already exists
  const listTablesCommand = new ListTablesCommand({});
  const { TableNames } = await client.send(listTablesCommand);
  
  if (TableNames.includes(CANDIDATES_TABLE)) {
    console.log(`Table ${CANDIDATES_TABLE} already exists.`);
    return;
  }
  
  // Table doesn't exist, create it
  const command = new CreateTableCommand({
    TableName: CANDIDATES_TABLE,
    KeySchema: [
      { AttributeName: 'pk', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'pk', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  });
  
  try {
    const result = await client.send(command);
    console.log(`Created table ${CANDIDATES_TABLE}. Table description: `, result);
  } catch (err) {
    console.error(`Error creating table ${CANDIDATES_TABLE}: `, err);
  }
}

// Run all table creation functions
async function createAllTables() {
  try {
    await createCandidatesTable();
    console.log('All tables created or verified.');
  } catch (err) {
    console.error('Error creating tables: ', err);
  }
}

// Execute if called directly
if (require.main === module) {
  createAllTables();
}

module.exports = {
  createAllTables
};