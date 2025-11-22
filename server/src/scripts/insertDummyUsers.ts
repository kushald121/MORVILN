import supabase from '../config/database';

async function insertDummyUsers() {
  try {
    console.log('🔄 Inserting dummy users...\n');

    const dummyUsers = [
      {
        email: 'alice@morviln.com',
        name: 'Alice Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        provider: 'google',
        provider_id: 'google_alice_123',
        is_verified: true
      },
      {
        email: 'bob@morviln.com',
        name: 'Bob Smith',
        avatar: 'https://i.pravatar.cc/150?img=12',
        provider: 'facebook',
        provider_id: 'facebook_bob_456',
        is_verified: true
      },
      {
        email: 'charlie@morviln.com',
        name: 'Charlie Davis',
        avatar: 'https://i.pravatar.cc/150?img=33',
        provider: 'email',
        provider_id: null,
        is_verified: false
      }
    ];

    for (const user of dummyUsers) {
      const { data, error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'email' })
        .select('id, email, name, provider');

      if (error) {
        console.error(`❌ Error inserting user ${user.email}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ ${data[0].name} (${data[0].email}) - ${data[0].provider}`);
      }
    }

    console.log('\n✅ All dummy users inserted successfully!');
    console.log('\n📊 Verify with:');
    console.log('SELECT id, email, name, provider, is_verified, created_at FROM users;');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting dummy users:', error);
    process.exit(1);
  }
}

insertDummyUsers();