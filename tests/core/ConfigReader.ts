import { envConfig } from "../configs/env.config";
import { runConfig } from "../configs/run.config";
import { envType, plaftormType } from "../utils/types";


export class ConfigReader {

  static getPlatform(): plaftormType {
    return runConfig.platform as plaftormType;
  }

  static getEnv(): envType {
    return runConfig.platformValues.env as envType;
  }

  static getBaseUrl(): string {

    if (!envConfig[this.getPlatform()][this.getEnv()]) {
      throw new Error(`Environment configuration for '${this.getEnv()}' is not defined for platform '${this.getPlatform()}'.`);
    }

    return envConfig[this.getPlatform()][this.getEnv()];
  }

  static getTags(): string {
    return runConfig.platformValues.tags;
  }
}
