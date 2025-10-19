require('dotenv').config();

console.log('🔍 Checking FCM Configuration...\n');

const fcmKey = process.env.FCM_SERVER_KEY;
const projectId = process.env.FCM_PROJECT_ID;
const clientEmail = process.env.FCM_CLIENT_EMAIL;

console.log('FCM_SERVER_KEY:', fcmKey ? '✅ SET (' + fcmKey.substring(0, 20) + '...)' : '❌ NOT SET');
console.log('FCM_PROJECT_ID:', projectId ? '✅ SET (' + projectId + ')' : '❌ NOT SET');
console.log('FCM_CLIENT_EMAIL:', clientEmail ? '✅ SET (' + clientEmail + ')' : '❌ NOT SET');

console.log('\n📋 Configuration Status:');

if (fcmKey && fcmKey.startsWith('BEmmo3cBEdP8pctXxwLko4NDTejtZNuQIs92HoYdblTkbahgzM18wpmBy7vQStFb0zAgJRrFrW_EDT5MnMJjoKQ')) {
  console.log('✅ FCM Server Key is correctly configured!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Restart your server: npm run dev');
  console.log('2. Server logs should show: "✅ Firebase Admin initialized for FCM"');
  console.log('3. Test with: curl -X POST http://localhost:5000/api/push/test -b cookies.txt');
} else if (fcmKey) {
  console.log('⚠️  FCM Server Key is set but might be incorrect');
  console.log('Expected to start with: BEmmo3cBEdP8pctXxwLko4NDTejtZNuQIs92HoYdblTkbahgzM18wpmBy7vQStFb0z...');
  console.log('Current starts with:', fcmKey.substring(0, 50) + '...');
} else {
  console.log('❌ FCM Server Key is not configured');
  console.log('\n📝 Add to .env:');
  console.log('FCM_SERVER_KEY=BEmmo3cBEdP8pctXxwLko4NDTejtZNuQIs92HoYdblTkbahgzM18wpmBy7vQStFb0zAgJRrFrW_EDT5MnMJjoKQ');
}

console.log('\n');
