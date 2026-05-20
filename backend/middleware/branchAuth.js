// branchAuth.js - Branch Code Authentication Middleware
// Validates branch code and attaches branch context to requests

const jwt = require('jsonwebtoken');
const dbManager = require('../services/DatabaseConnectionManager');

/**
 * Middleware to validate branch code from request
 * Branch code can come from:
 * 1. JWT token (req.user.branchCode)
 * 2. Request header (x-branch-code)
 * 3. Query parameter (?branchCode=XXX)
 */
const validateBranchCode = async (req, res, next) => {
  try {
    let branchCode = null;

    // Priority 1: Get from JWT token (if user is authenticated)
    if (req.user && req.user.branchCode) {
      branchCode = req.user.branchCode;
    }
    
    // Priority 2: Get from header
    if (!branchCode && req.headers['x-branch-code']) {
      branchCode = req.headers['x-branch-code'];
    }
    
    // Priority 3: Get from query parameter
    if (!branchCode && req.query.branchCode) {
      branchCode = req.query.branchCode;
    }

    // If no branch code provided, return error
    if (!branchCode) {
      return res.status(400).json({ 
        error: 'Branch code is required',
        message: 'Please provide branch code in header (x-branch-code), query parameter (?branchCode=XXX), or login with branch code'
      });
    }

    // Validate branch code format (3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(branchCode)) {
      return res.status(400).json({ 
        error: 'Invalid branch code format',
        message: 'Branch code must be 3 uppercase letters (e.g., MAI, AMA, SOL)'
      });
    }

    // Get database pool for this branch
    try {
      const pool = await dbManager.getPool(branchCode);
      
      // Attach branch context to request
      req.branchCode = branchCode;
      req.branchPool = pool;
      
      next();
    } catch (error) {
      return res.status(404).json({ 
        error: 'Branch not found',
        message: `No active branch found with code: ${branchCode}`,
        details: error.message
      });
    }

  } catch (error) {
    console.error('Branch validation error:', error);
    return res.status(500).json({ 
      error: 'Branch validation failed',
      message: error.message
    });
  }
};

/**
 * Enhanced JWT authentication middleware with branch support
 * Validates JWT token and extracts branch code
 */
const authenticateWithBranch = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request (includes branchCode)
    req.user = user;
    
    // Continue to branch validation
    validateBranchCode(req, res, next);
  });
};

/**
 * Generate JWT token with branch context
 */
const generateBranchToken = (userData, branchCode, expiresIn = '24h') => {
  const payload = {
    ...userData,
    branchCode: branchCode
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: expiresIn
  });
};

module.exports = {
  validateBranchCode,
  authenticateWithBranch,
  generateBranchToken
};
