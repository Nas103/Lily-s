const { PrismaClient } = require('@prisma/client');

async function verifyTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Missing ✗');
    console.log('');
    
    // Try to query the User table
    console.log('📊 Checking User table...');
    const userCount = await prisma.user.count();
    console.log(`✅ User table exists! Found ${userCount} users.`);
    console.log('');
    
    // Check all tables
    console.log('📋 Checking all tables...');
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();
    
    console.log(`✅ Category table: ${categoryCount} records`);
    console.log(`✅ Product table: ${productCount} records`);
    console.log(`✅ Order table: ${orderCount} records`);
    console.log(`✅ OrderItem table: ${orderItemCount} records`);
    console.log('');
    console.log('✅ All tables exist and are accessible!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('');
      console.log('🔧 The table might have a different name or schema.');
      console.log('Try running: npx prisma db push');
    } else if (error.message.includes('Can\'t reach database')) {
      console.log('');
      console.log('🔧 Database connection issue.');
      console.log('Check your DATABASE_URL in .env.local');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTables();

