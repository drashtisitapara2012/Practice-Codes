
const Sentry = require("@sentry/node");

// Initialize Sentry
Sentry.init({
  dsn: "https://5a27f14f4e7925c5f31e6e484e07ebbe@o4510622548623360.ingest.us.sentry.io/4510622721507328",
  tracesSampleRate: 1.0, // demo only
});

console.log("Sentry demo started...");

// ---- USER & CONTEXT ----
Sentry.setUser({
  id: "101",
  email: "demo@sentry.io",
});

Sentry.setContext("demo_app", {
  env: "development",
  feature: "sentry-demo",
});

// ---- ERROR CAPTURE ----
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed!");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (err) {
  Sentry.captureException(err);
}

// ---- MANUAL LOG ----
Sentry.captureMessage("This is a custom log message from Node.js demo");

// ---- PERFORMANCE (NEW WAY) ----
Sentry.startSpan(
  {
    name: "slow-operation",
    op: "task",
  },
  async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Slow operation finished");
  }
);

// ---- UNHANDLED ERROR (AUTO CAPTURE) ----
setTimeout(() => {
  JSON.parse("{ invalid json }");
}, 3000);