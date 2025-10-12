import { Config, defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./data.sqlite',
    encryptionKey: 'mysecretkey',
  },
  schema: './src/database/schema/schema.ts',
  out: 'drizzle',
} as unknown as Config);
