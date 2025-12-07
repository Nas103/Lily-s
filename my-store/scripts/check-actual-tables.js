const { PrismaClient } = require('@prisma/client');

async function checkTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking actual table names in database...');
    console.log('');
    
    // Query PostgreSQL system catalog to see actual table names
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📋 Tables found in database:');
    result.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');
    
    // Check if User table exists (case-sensitive)
    const userTable = result.find(t => t.table_name === 'User');
    const userTableLower = result.find(t => t.table_name === 'user');
    
    if (userTable) {
      console.log('✅ Found "User" table (capital U)');
    } else if (userTableLower) {
      console.log('⚠️  Found "user" table (lowercase) - this is the problem!');
      console.log('   Prisma expects "User" but database has "user"');
      console.log('');
      console.log('🔧 Solution: Rename the table in Supabase SQL Editor:');
      console.log('   ALTER TABLE "user" RENAME TO "User";');
    } else {
      console.log('❌ No User table found at all!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Try direct SQL query
    try {
      console.log('');
      console.log('Trying alternative method...');
      const tables = await prisma.$queryRaw`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
      `;
      
      console.log('📋 Tables (alternative method):');
      tables.forEach((row) => {
        console.log(`   - ${row.tablename}`);
      });
    } catch (e) {
      console.error('Alternative method also failed:', e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

