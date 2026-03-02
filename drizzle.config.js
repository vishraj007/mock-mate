import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
  url:'postgresql://neondb_owner:npg_hxD8qi7NfLoT@ep-noisy-water-ahgkkpvn-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  }
});