// Database Verification Script
// Run with: node scripts/verify-db.js
// Make sure DATABASE_URL is set in .env.local or environment

// Try to load .env.local if it exists
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  try {
    // Try UTF-8 first, then UTF-16LE if that fails
    let envContent;
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
      // Check if it's actually UTF-16 by looking for null bytes
      if (envContent.includes('\u0000')) {
        envContent = fs.readFileSync(envPath, 'utf16le');
        // Remove null bytes that might be between characters
        envContent = envContent.replace(/\0/g, '');
      }
    } catch (e) {
      // Try UTF-16LE
      envContent = fs.readFileSync(envPath, 'utf16le').replace(/\0/g, '');
    }
    
    const lines = envContent.split(/\r?\n/);
    
    lines.forEach(line => {
      line = line.trim();
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;
      
      // Match key=value pattern
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        let value = line.substring(equalIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Set environment variable if not already set
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    // Ignore errors, use environment variables directly
  }
}

const { PrismaClient } = require('@prisma/client');

async function verifyDatabase() {
  console.log('🔍 Verifying Database Configuration...\n');

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('\n💡 To verify your database:');
    console.log('   1. Get DATABASE_URL from Vercel: vercel env pull .env.local');
    console.log('   2. Or set it manually in .env.local');
    console.log('   3. Then run: node scripts/verify-db.js');
    console.log('\n   For Supabase:');
    console.log('   - Go to Supabase Dashboard → Settings → Database');
    console.log('   - Copy Connection String (use Connection Pooling for production)');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
  console.log(`   Connection: ${maskedUrl}\n`);

  // Initialize Prisma
  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    console.log('🔌 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Check if tables exist by querying them
    console.log('📊 Verifying database schema...\n');

    const tables = {
      User: false,
      Category: false,
      Product: false,
      Order: false,
      OrderItem: false,
    };

    // Check each table
    for (const [tableName, model] of Object.entries({
      User: prisma.user,
      Category: prisma.category,
      Product: prisma.product,
      Order: prisma.order,
      OrderItem: prisma.orderItem,
    })) {
      try {
        const count = await model.count();
        tables[tableName] = true;
        console.log(`✅ ${tableName} table exists (${count} records)`);
      } catch (error) {
        if (error.message?.includes('does not exist') || error.code === 'P2021') {
          console.log(`❌ ${tableName} table does not exist`);
        } else {
          console.log(`⚠️  ${tableName} table check failed: ${error.message}`);
        }
      }
    }

    // Check schema structure using raw SQL
    console.log('\n📋 Schema Structure:');
    try {
      const result = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
      
      const dbTables = result.map(r => r.table_name);
      const expectedTables = ['User', 'Category', 'Product', 'Order', 'OrderItem'];
      
      console.log(`   Found ${dbTables.length} tables in database`);
      expectedTables.forEach(table => {
        if (dbTables.includes(table)) {
          console.log(`   ✅ ${table}`);
        } else {
          console.log(`   ❌ ${table} (missing)`);
        }
      });

      // Check for extra tables
      const extraTables = dbTables.filter(t => !expectedTables.includes(t));
      if (extraTables.length > 0) {
        console.log(`\n   ℹ️  Additional tables found: ${extraTables.join(', ')}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not query schema: ${error.message}`);
    }

    // Summary
    const allTablesExist = Object.values(tables).every(exists => exists);
    console.log('\n' + '='.repeat(50));
    if (allTablesExist) {
      console.log('✅ All database tables are properly configured!');
      console.log('\n💡 Next steps:');
      console.log('   - Your database is ready to use');
      console.log('   - Make sure DATABASE_URL is set in Vercel for production');
      console.log('   - Redeploy your application if needed');
    } else {
      console.log('⚠️  Some tables are missing');
      console.log('\n💡 To fix:');
      console.log('   Run: npx prisma db push');
      console.log('   This will create all missing tables');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Database verification failed:');
    console.error(`   ${error.message}`);
    
    if (error.message?.includes('P1001') || error.code === 'P1001') {
      console.log('\n💡 Connection error - Check:');
      console.log('   - Database is running and accessible');
      console.log('   - DATABASE_URL is correct');
      console.log('   - Network/firewall allows connections');
      console.log('   - For Supabase: Check if database is paused');
    } else if (error.message?.includes('P1003') || error.code === 'P1003') {
      console.log('\n💡 Database does not exist');
      console.log('   - Create it in Supabase dashboard');
    } else if (error.message?.includes('authentication') || error.code === 'P1000') {
      console.log('\n💡 Authentication failed');
      console.log('   - Check DATABASE_URL credentials');
      console.log('   - Verify username and password are correct');
    } else if (error.code === 'P2021') {
      console.log('\n💡 Table does not exist');
      console.log('   - Run: npx prisma db push');
      console.log('   - This will create all required tables');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase().catch(console.error);

