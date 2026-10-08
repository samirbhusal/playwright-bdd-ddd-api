import type { Reporter, TestError } from "@playwright/test/reporter";
import { ConfigReader } from "./ConfigReader";

export default class SelectionErrorReporter implements Reporter {
  onError(error: TestError): void {
    if (!error.message?.includes("No tests found")) {
      return;
    }

    console.error(
      "\nNo scenarios matched the test selection.\n" +
      `PLATFORM=${ConfigReader.getPlatform()}, ENV=${ConfigReader.getEnv()}, TAGS=${ConfigReader.getTags() || "(all)"}\n` +
      `Feature path: tests/${ConfigReader.getPlatform()}/**/features/*.feature\n` +
      "Check PLATFORM and TAGS in .env. Tags are case-sensitive.\n",
    );
  }
}
