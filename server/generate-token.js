/**
 * Token Generation Script
 * 
 * This script generates a JWT bearer token for testing API endpoints.
 */

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret_key';

// Generate a token with a sample user payload
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Sample user data (this would normally come from your database)
const sampleUsers = [
  {
    id: '2765821e-779a-42a0-88cb-1f563346a745',
    userId: '2765821e-779a-42a0-88cb-1f563346a745',
    email: 'aniketsinghs718@gmail.com',
    name: 'Aniket Singh'
  },
  {
    id: 'user_001',
    userId: 'user_001',
    email: 'test1@example.com',
    name: 'Test User 1'
  },
  {
    id: 'user_002',
    userId: 'user_002',
    email: 'test2@example.com',
    name: 'Test User 2'
  },
  {
    id: 'user_003',
    userId: 'user_003',
    email: 'test3@example.com',
    name: 'Test User 3'
  },
  {
    id: 'user_004',
    userId: 'user_004',
    email: 'test4@example.com',
    name: 'Test User 4'
  },
  {
    id: 'user_005',
    userId: 'user_005',
    email: 'test5@example.com',
    name: 'Test User 5'
  }
];

console.log('🔐 JWT Token Generator\n');

// Generate tokens for all sample users
sampleUsers.forEach((user, index) => {
  const token = generateToken(user);
  console.log(`${index + 1}. User: ${user.name} (${user.email})`);
  console.log(`   Token: ${token}\n`);
});

console.log('📋 Usage Examples:\n');
console.log('Using curl:');
console.log('curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/auth/me\n');
console.log('Using axios:');
console.log(`
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
});

// Make authenticated requests
api.get('/auth/me')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
`);