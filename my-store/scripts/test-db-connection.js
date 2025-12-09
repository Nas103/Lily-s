/**
 * Test database connection
 */

require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  const prisma = new PrismaClient({
    log: ["query", "error", "warn"],
  });

  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "NOT SET");
    
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set in .env.local");
      process.exit(1);
    }

    // Test connection
    await prisma.$connect();
    console.log("✅ Successfully connected to database");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database is accessible. User count: ${userCount}`);

    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log("✅ Tables found:", tables.map((t) => t.table_name).join(", "));

  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.message.includes("Tenant or user not found")) {
      console.error("\n💡 This usually means:");
      console.error("   1. The database password is incorrect");
      console.error("   2. The project ID in the connection string is wrong");
      console.error("   3. The database credentials have changed");
      console.error("\n📝 To fix:");
      console.error("   1. Go to Supabase Dashboard");
      console.error("   2. Settings → Database");
      console.error("   3. Copy the Connection Pooling string (Transaction pooler, port 6543)");
      console.error("   4. Update DATABASE_URL in .env.local");
    } else if (error.message.includes("Can't reach database")) {
      console.error("\n💡 This usually means:");
      console.error("   1. The database host is incorrect");
      console.error("   2. Network connectivity issues");
      console.error("   3. The database is paused or deleted");
    } else if (error.message.includes("authentication failed")) {
      console.error("\n💡 This usually means:");
      console.error("   1. The password is incorrect");
      console.error("   2. Special characters in password need URL encoding");
      console.error("   3. The username is incorrect");
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

