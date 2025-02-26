import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: './configs/schema.js',
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_X5eso1xDEUOI@ep-royal-boat-a8biwtk2-pooler.eastus2.azure.neon.tech/VoiceFlow?sslmode=require",
  },
});