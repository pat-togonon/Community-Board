import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      BASEURL_BACKEND: "http://localhost:3001/api",
      BASEURL_FRONTEND: "http://localhost:5173"
    },
  },
});
