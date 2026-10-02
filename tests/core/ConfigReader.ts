import { envConfig } from "../configs/env.config";
import { runConfig } from "../configs/run.config";
import { envType, plaftormType } from "../utils/types";


export class ConfigReader {

  static getPlatform(): plaftormType {
    const platform = runConfig.platform;
    if (platform !== "api" && platform !== "web") {
      throw new Error(`Unsupported platform '${platform}'. Use 'api' or 'web'.`);
    }
    return platform;
  }

  static getEnv(): envType {
    return runConfig.env as envType;
  }

  static getBaseUrl(): string {

    if (!envConfig[this.getPlatform()][this.getEnv()]) {
      throw new Error(`Environment configuration for '${this.getEnv()}' is not defined for platform '${this.getPlatform()}'.`);
    }

    return envConfig[this.getPlatform()][this.getEnv()];
  }

  static getTags(): string {
    return runConfig.tags;
  }
}
