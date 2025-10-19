"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
async function insertDummyUsers() {
    try {
        console.log('🔄 Inserting dummy users...\n');
        const dummyUsers = [
            {
                email: 'alice@morviln.com',
                name: 'Alice Johnson',
                avatar: 'https://i.pravatar.cc/150?img=1',
                provider: 'google',
                providerId: 'google_alice_123',
                isVerified: true
            },
            {
                email: 'bob@morviln.com',
                name: 'Bob Smith',
                avatar: 'https://i.pravatar.cc/150?img=12',
                provider: 'facebook',
                providerId: 'facebook_bob_456',
                isVerified: true
            },
            {
                email: 'charlie@morviln.com',
                name: 'Charlie Davis',
                avatar: 'https://i.pravatar.cc/150?img=33',
                provider: 'email',
                providerId: null,
                isVerified: false
            }
        ];
        for (const user of dummyUsers) {
            const query = `
        INSERT INTO users (email, name, avatar, provider, provider_id, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          avatar = EXCLUDED.avatar,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, email, name, provider
      `;
            const values = [
                user.email,
                user.name,
                user.avatar,
                user.provider,
                user.providerId,
                user.isVerified
            ];
            const result = await database_1.default.query(query, values);
            console.log(`✅ ${result.rows[0].name} (${result.rows[0].email}) - ${result.rows[0].provider}`);
        }
        console.log('\n✅ All dummy users inserted successfully!');
        console.log('\n📊 Verify with:');
        console.log('SELECT id, email, name, provider, is_verified, created_at FROM users;');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error inserting dummy users:', error);
        process.exit(1);
    }
}
insertDummyUsers();
