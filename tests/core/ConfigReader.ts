import { envConfig } from "../configs/env.config";
import { runConfig } from "../configs/run.config";

export class ConfigReader {
  static getPlatform(): string {
    return runConfig.platform;
  }

  static getEnv(): string {
    return runConfig.platformValues.env;
  }

  static getBaseUrl(): string {
    const env = this.getEnv();

    if (!envConfig[env as keyof typeof envConfig]) {
      throw new Error(`Environment configuration for '${env}' is not defined.`);
    }
    return envConfig[env as keyof typeof envConfig].baseUrl;
  }

  static getTags(): string {
    return runConfig.platformValues.tags;
  }
}
