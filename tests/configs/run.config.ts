export const runConfig = {
  platform: process.env.PLATFORM || "api",
  platformValues: {
    env: process.env.ENV || "dev",
    tags: process.env.TAGS || "@api",
  },
};
