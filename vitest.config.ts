import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL!
    }
  }
})