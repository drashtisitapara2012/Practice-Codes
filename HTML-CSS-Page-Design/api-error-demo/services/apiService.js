import fetch from "node-fetch";
import { log } from "../utils/logger.js";

export const apis = [
  "https://jsonplaceholder.typicode.com/users",  //valid
  "https://jsonplaceholder.typicode.com/invalid-url",   //404 not found
  "https://httpstat.us/429",  // too many request
  "https://httpstat.us/500",  //Internal server errror
  "https://10.255.255.1"  //RTO
];

export function fetchWithTimeout(url, options = {}, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout Error")), timeout);
    fetch(url, options)
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// export async function fetchApi(url) {
//   try {
//     const response = await fetchWithTimeout(url, {}, 2000);
//     if (!response.ok) {
//       log(`API Error [${url}]: ${response.status} ${response.statusText}`);
//       return;
//     }
//     await response.json().catch(() => null);
//     log(`Success [${url}]`);
//   } catch (error) {
//     if (error.message === "Timeout Error") log(`Timeout Error [${url}]`);
//     else log(`Network / Other Error [${url}]: ${error.message}`);
//   }
// }

//handle only RTO error
export async function fetchApi(url) {
  try {
    await fetchWithTimeout(url, {}, 2000);
    log(`API Success [${url}]`);
  } catch (error) {
    if (error.message === "Timeout Error") {
      log(`RTO Error [${url}]`);
    }
    // ignore other errors
  }
}

export async function callApisSequential() {
  log("=== Sequential API calls ===");
  for (let url of apis) await fetchApi(url);
}

export async function callApisParallel() {
  log("=== Parallel API calls ===");
  await Promise.all(apis.map(url => fetchApi(url)));
}
