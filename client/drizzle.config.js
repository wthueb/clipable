/** @type { import("drizzle-kit").Config } */
export default {
    schema: './src/lib/db/schema.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
