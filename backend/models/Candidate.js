const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { TABLES, getItem, putItem, updateItem, deleteItem, scanItems, queryItems } = require('../config/dynamodb');

// CandidateModel class to replace Mongoose model
class CandidateModel {
  // Create a new candidate
  static async create(candidateData) {
    // Generate a unique ID if not provided
    if (!candidateData.id) {
      candidateData.id = 'CAN-' + Math.floor(100000 + Math.random() * 900000);
    }
    
    // Generate an access key if not provided
    if (!candidateData.accessCode) {
      candidateData.accessCode = crypto.randomBytes(8).toString('hex');
    }
    
    // Add timestamps
    const now = new Date().toISOString();
    candidateData.createdAt = now;
    candidateData.updatedAt = now;
    
    // Default isUnlocked to false if not provided
    if (candidateData.isUnlocked === undefined) {
      candidateData.isUnlocked = false;
    }
    
    // Add a unique DynamoDB identifier
    candidateData.pk = candidateData.id;
    
    // Store in DynamoDB
    await putItem(TABLES.CANDIDATES, candidateData);
    
    return candidateData;
  }
  
  // Find candidate by ID
  static async findById(id) {
    return getItem(TABLES.CANDIDATES, { pk: id });
  }
  
  // Update candidate
  static async update(id, updateData) {
    // Don't update pk or id
    delete updateData.pk;
    delete updateData.id;
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Convert update data to DynamoDB update expression
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    Object.entries(updateData).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
      expressionAttributeNames[`#${key}`] = key;
    });
    
    const updateExpression = `SET ${updateExpressions.join(', ')}`;
    
    // Update in DynamoDB
    const updatedCandidate = await updateItem(
      TABLES.CANDIDATES,
      { pk: id },
      updateExpression,
      expressionAttributeValues,
      expressionAttributeNames
    );
    
    return updatedCandidate;
  }
  
  // Delete candidate
  static async delete(id) {
    return deleteItem(TABLES.CANDIDATES, { pk: id });
  }
  
  // Find all candidates
  static async findAll() {
    return scanItems(TABLES.CANDIDATES);
  }
  
  // Search candidates
  static async search(searchTerm) {
    const allCandidates = await scanItems(TABLES.CANDIDATES);
    
    // Filter on client side since DynamoDB doesn't support complex text search easily
    return allCandidates.filter(candidate => {
      const searchString = searchTerm.toLowerCase();
      return (
        (candidate.id && candidate.id.toLowerCase().includes(searchString)) ||
        (candidate.name && candidate.name.toLowerCase().includes(searchString)) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchString)) ||
        (candidate.phone && candidate.phone.toLowerCase().includes(searchString)) ||
        (candidate.linkedin && candidate.linkedin.toLowerCase().includes(searchString))
      );
    });
  }
  
  // Set isUnlocked to true
  static async unlock(id) {
    return updateItem(
      TABLES.CANDIDATES,
      { pk: id },
      'SET isUnlocked = :isUnlocked, updatedAt = :updatedAt',
      { 
        ':isUnlocked': true,
        ':updatedAt': new Date().toISOString()
      },
      { '#isUnlocked': 'isUnlocked' }
    );
  }
}

module.exports = CandidateModel;