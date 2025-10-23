const bcrypt = require('bcryptjs');

// The hash from your database
const hashFromDB = '$2a$10$Fz059CPav39G4TnyK5g0d.NGaje3PGeo20hEUHXczsHo4419j/I4e';

// Test different passwords
const passwords = ['Admin@1234', 'password', 'admin', 'test123', 'content123', 'superadmin'];

console.log('Testing password hash:', hashFromDB);
console.log('\nTesting passwords:');

passwords.forEach(password => {
  const isValid = bcrypt.compareSync(password, hashFromDB);
  console.log(`Password: "${password}" -> ${isValid ? '✅ MATCH' : '❌ NO MATCH'}`);
});

// Generate new hash
console.log('\n=== Generate New Hash ===');
const newPassword = 'admin123';
const newHash = bcrypt.hashSync(newPassword, 10);
console.log(`Password: ${newPassword}`);
console.log(`New Hash: ${newHash}`);
console.log(`\nSQL to update superadmin:`);
console.log(`UPDATE admin_users SET password_hash = '${newHash}' WHERE email = 'superadmin@morviln.com';`);
console.log(`\nSQL to update content manager:`);
console.log(`UPDATE admin_users SET password_hash = '${newHash}' WHERE email = 'content@morviln.com';`);
