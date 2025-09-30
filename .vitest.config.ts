import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: [
      //   "<rootDir>/test/__mocks__/requestAnimationFrame.js",
      "test/setup_vitest.js",
      "./vitest.js",
    ],
    snapshotSerializers: ["enzyme-to-json/serializer"],
    environment: "jsdom",
    // testPathIgnorePatterns: ["<rootDir>/test/native", "<rootDir>/test/preact"],

    include: ["**/*.vitest.jsx"],
  },
});
