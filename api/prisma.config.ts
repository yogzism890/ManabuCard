import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  env: {
    DATABASE_URL: "postgresql://username:password@localhost:5432/manabucards?schema=public",
  },
});
