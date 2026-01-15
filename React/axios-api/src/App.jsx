import React, { useEffect } from "react";
import axios from "axios";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf","text/plain"];
// Create Axios instance 
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000, // 5 seconds timeout
  headers: {
    Accept: "application/json",
  },
 transformRequest: [
  (data, headers) => {
    if (data instanceof FormData) return data;

    if (data instanceof URLSearchParams) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      return data.toString();
    }

    headers["Content-Type"] = "application/json";
    return JSON.stringify(data);
  },
],

   transformResponse: [
  (data) => {
    // Handle empty response 
    if (!data) {
      return {
        success: true,
        data: null,
        receivedAt: new Date().toISOString(),
      };
    }
    // Handle JSON safely
    try {
      const parsed = JSON.parse(data);
      return {
        success: true,
        data: parsed,
        receivedAt: new Date().toISOString(),
      };
    } catch {
      // Non-JSON response 
      return data;
    }
  },
],

});

// Request Interceptor (adds token dynamically)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // example token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const method = config.method?.toLowerCase();

    //  Validate only for write methods
    if (!["post", "put", "patch"].includes(method)) {
      return config;
    }

    // Validate only multipart requests
    if (!(config.data instanceof FormData)) {
      return config;
    }

    // File validation
    for (let [key, value] of config.data.entries()) {
      if (value instanceof File) {
        // File size check
        if (value.size > MAX_FILE_SIZE) {
          return Promise.reject(
            new Error(`"${value.name}" exceeds allowed size`)
          );
        }

        // File type check
        if (!ALLOWED_TYPES.includes(value.type)) {
          return Promise.reject(
            new Error(`"${value.type}" is not allowed`)
          );
        }
      }
    }
    console.log("Request Sent:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (logs & handles 401)
api.interceptors.response.use(
  (response) => {
    console.log("Response Received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Server Error:", error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting...");
      }
    } else if (error.request) {
      console.error("Network Error or Server not reachable", error.message);
    } else {
      console.error("Error in request setup", error.message);
    }
    return Promise.reject(error);
  }
);

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Path Variable Example 
        const userId = 3;
        const pathResponse = await api.get(`/users/${userId}`);
        console.log("Path Variable (userId=3):", pathResponse.data);

        //  Query Parameter Example 
        const queryResponse = await api.get("/users", {
          params: { _limit: 2 },
        });
        console.log("Query Parameters (_limit=2):", queryResponse.data);

        //  GET Request 
        const getUsers = await api.get("/users", {
          params: { _limit: 3 }, // query params
          headers: { "X-Custom-Header": "GET-Example" },
        });
        console.log("GET Users:", getUsers.data);

        //  POST Request 
        const newPost = await api.post(
          "/posts",
          { title: "Axios Mastery", body: "Learning deeply", userId: 1 },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("POST Response:", newPost.data);

        //  PUT Request 
        const updatedPost = await api.put(
          "/posts/1",
          { title: "Updated Post", body: "Full replace", userId: 1 }
        );
        console.log("PUT Response:", updatedPost.data);

        //  PATCH Request 
        const patchedPost = await api.patch("/posts/1", { title: "Partial Update" });
        console.log("PATCH Response:", patchedPost.data);

        //  DELETE Request 
        const deletedPost = await api.delete("/posts/1");
        console.log("DELETE Response:", deletedPost.status);

        //  FormData Example 
        const formData = new FormData();
        formData.append("username", "Drashti");
        formData.append("file", new Blob(["hello"], { type: "text/plain" }));

        const upload = await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("FormData Upload Response:", upload.data);

        //  URL-Encoded Example 
        const urlData = new URLSearchParams();
        urlData.append("username", "admin");
        urlData.append("password", "1234");

        const login = await api.post("/posts", urlData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        console.log("URL-Encoded Response:", login.data);

        //  Cancel Request Example 
        const controller = new AbortController();
        const cancelReq = api.get("/users", { signal: controller.signal });
        controller.abort();
        await cancelReq.catch((err) => console.warn("Request Canceled:", err.message));

        //  Retry Example 
        let retries = 0;
        const maxRetries = 2;

        const fetchWithRetry = async () => {
          try {
            return await api.get("/invalid-endpoint"); // intentionally wrong
          } catch (err) {
            if (err.response?.status >= 500 && retries < maxRetries) {
              retries++;
              console.warn(`Retry attempt ${retries}`);
              return fetchWithRetry();
            }
            throw err;
          }
        };
        await fetchWithRetry().catch((err) => console.error("Retry failed:", err.message));

        //  User-Agent Demo 
        // Browser may override User-Agent
        const uaResponse = await api.get("/users", {
          headers: { "User-Agent": "React-App-Demo/1.0" },
        });
        console.log("User-Agent Demo Response:", uaResponse.data);

        //  Public IP Demo 
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        console.log("Your Public IP:", ipResponse.data.ip);

      } catch (err) {
        console.error("Final Catch:", err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>Axios Complete Demo</h3>
      <p>Open console to see Path, Query, Headers, User-Agent, IP, GET/POST/PUT/PATCH/DELETE</p>
    </div>
  );
}

export default App;
