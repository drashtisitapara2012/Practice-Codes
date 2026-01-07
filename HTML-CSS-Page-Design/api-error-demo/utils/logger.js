import fs from "fs";
import path from "path";

const logFilePath = path.join("./data/logs.txt");

export function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFilePath, logMessage);
}
