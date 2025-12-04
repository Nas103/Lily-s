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

export const prisma =
  PrismaClientConstructor && process.env.DATABASE_URL
    ? (globalForPrisma.prisma ??
        new PrismaClientConstructor({
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        }))
    : undefined;

if (prisma && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


