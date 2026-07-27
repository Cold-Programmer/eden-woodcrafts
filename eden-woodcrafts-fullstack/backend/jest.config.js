/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.test.js"],
  clearMocks: true
};
