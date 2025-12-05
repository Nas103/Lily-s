// Database Verification Script
// Run with: npx tsx scripts/verify-db.ts
// Or: npx ts-node scripts/verify-db.ts

import { PrismaClient } from '@prisma/client';

async function verifyDatabase() {
  console.log('🔍 Verifying Database Configuration...\n');

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('\n💡 Set DATABASE_URL in:');
    console.log('   - .env.local (for local development)');
    console.log('   - Vercel Environment Variables (for production)');
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

    // Check User table
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table exists (${userCount} users)`);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.log('❌ User table does not exist');
      } else {
        console.log(`⚠️  User table check: ${error.message}`);
      }
    }

    // Check Category table
    try {
      const categoryCount = await prisma.category.count();
      console.log(`✅ Category table exists (${categoryCount} categories)`);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.log('❌ Category table does not exist');
      } else {
        console.log(`⚠️  Category table check: ${error.message}`);
      }
    }

    // Check Product table
    try {
      const productCount = await prisma.product.count();
      console.log(`✅ Product table exists (${productCount} products)`);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.log('❌ Product table does not exist');
      } else {
        console.log(`⚠️  Product table check: ${error.message}`);
      }
    }

    // Check Order table
    try {
      const orderCount = await prisma.order.count();
      console.log(`✅ Order table exists (${orderCount} orders)`);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.log('❌ Order table does not exist');
      } else {
        console.log(`⚠️  Order table check: ${error.message}`);
      }
    }

    // Check OrderItem table
    try {
      const orderItemCount = await prisma.orderItem.count();
      console.log(`✅ OrderItem table exists (${orderItemCount} order items)`);
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.log('❌ OrderItem table does not exist');
      } else {
        console.log(`⚠️  OrderItem table check: ${error.message}`);
      }
    }

    // Check schema structure
    console.log('\n📋 Schema Verification:');
    try {
      // Try to query schema information
      const result = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      ` as Array<{ table_name: string }>;
      
      const tables = result.map(r => r.table_name);
      const expectedTables = ['User', 'Category', 'Product', 'Order', 'OrderItem'];
      
      console.log(`   Found ${tables.length} tables in database`);
      expectedTables.forEach(table => {
        if (tables.includes(table)) {
          console.log(`   ✅ ${table}`);
        } else {
          console.log(`   ❌ ${table} (missing)`);
        }
      });
    } catch (error: any) {
      console.log(`   ⚠️  Could not query schema: ${error.message}`);
    }

    console.log('\n✅ Database verification complete!');
    
  } catch (error: any) {
    console.error('\n❌ Database verification failed:');
    console.error(`   ${error.message}`);
    
    if (error.message?.includes('P1001')) {
      console.log('\n💡 Connection error - Check:');
      console.log('   - Database is running and accessible');
      console.log('   - DATABASE_URL is correct');
      console.log('   - Network/firewall allows connections');
    } else if (error.message?.includes('P1003')) {
      console.log('\n💡 Database does not exist - Create it in Supabase dashboard');
    } else if (error.message?.includes('authentication')) {
      console.log('\n💡 Authentication failed - Check DATABASE_URL credentials');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase().catch(console.error);

