import { callApisSequential, callApisParallel } from "./services/apiService.js";

(async function runDemo() {
  await callApisSequential();
  await callApisParallel();
})();
