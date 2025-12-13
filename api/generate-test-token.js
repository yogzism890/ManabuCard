
import jwt from 'jsonwebtoken';

// Generate test token untuk development
const secret = 'manabucard_dev_secret_key_2024'; // Harus sama dengan auth.ts

const testToken = jwt.sign(
  { 
    userId: '550e8400-e29b-41d4-a716-446655440000', 
    email: 'test@manabucard.com' 
  },
  secret,
  { expiresIn: '24h' }
);

console.log('Test Token untuk API Testing:');
console.log(testToken);
console.log('\nUsage:');
console.log('curl -H "Authorization: Bearer ' + testToken + '" http://localhost:3000/api/koleksi');
