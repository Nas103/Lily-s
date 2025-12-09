// Prisma is optional in this starter; we only initialize it when the package is installed.
// This keeps `next build` happy even if the user never runs `prisma generate`.
type PrismaClientInstance = Record<string, unknown>;

let PrismaClientConstructor: { new (...args: unknown[]): PrismaClientInstance } | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientConstructor = require("@prisma/client").PrismaClient;
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(
    "[prisma] @prisma/client is not installed. Database features stay disabled until you add it."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientInstance;
};

// Helper to add pgbouncer parameter for Connection Pooling
function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  
  // If using Connection Pooling (has "pooler" in URL), add pgbouncer parameter
  if (url.includes("pooler")) {
    try {
      // Parse existing query params
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      // Add/update connection pool parameters
      params.set("pgbouncer", "true");
      params.set("connect_timeout", "30"); // Increased from 15 to 30 seconds
      params.set("pool_timeout", "30"); // Connection pool timeout
      params.set("connection_limit", "20"); // Increase pool size (Supabase allows up to 200)
      
      // Reconstruct URL with updated params
      urlObj.search = params.toString();
      return urlObj.toString();
    } catch (error) {
      // If URL parsing fails, fall back to simple string manipulation
      console.warn("[prisma] Failed to parse DATABASE_URL, using simple string manipulation");
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}pgbouncer=true&connect_timeout=30&pool_timeout=30&connection_limit=20`;
    }
  }
  
  return url;
}

export const prisma =
  PrismaClientConstructor && process.env.DATABASE_URL
    ? (globalForPrisma.prisma ??
        new PrismaClientConstructor({
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
          datasources: {
            db: {
              url: getDatabaseUrl(),
            },
          },
          // Connection pool configuration
          // Note: Prisma uses connection pooling via the DATABASE_URL parameters
          // For serverless environments, we rely on Supabase's connection pooler
        }))
    : undefined;

if (prisma && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


