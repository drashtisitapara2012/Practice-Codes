import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";
import LogRocket from "logrocket";

/**
 * LogRocket Init
 */
LogRocket.init("your-org/your-app");

/**
 *  Sentry Init (NEW API)
 */
Sentry.init({
  dsn: "https://YOUR_KEY@o0.ingest.sentry.io/PROJECT_ID",
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0
});

/**
 * Link LogRocket session to Sentry (NEW WAY)
 */
LogRocket.getSessionURL(sessionURL => {
  Sentry.setExtra("logrocketSession", sessionURL);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
