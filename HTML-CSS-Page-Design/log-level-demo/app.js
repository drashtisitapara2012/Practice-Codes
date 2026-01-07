const winston = require("winston");

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
  },
};

winston.addColors(customLevels.levels);


const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "info", // change this to info / warn / debug
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, ...meta }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta) : ""
        }`
    )
  ),
  transports: [new winston.transports.Console()]
});


function checkoutOrder(userId, cart) {
  logger.trace("Entered checkoutOrder()", { userId });

  logger.debug("Validating cart items", {
    itemCount: cart.items.length
  });

  logger.info("Checkout started", {
    userId,
    totalAmount: cart.total
  });

  if (cart.total > 5000) {
    logger.warn("High value order detected", {
      total: cart.total
    });
  }

  try {
    simulatePayment(cart.total);
  } catch (err) {
    logger.error("Payment failed", {
      userId,
      error: err.message
    });
  }

  if (!isDatabaseConnected()) {
    logger.fatal("Database is down. Shutting down application.");
    process.exit(1);
  }

  logger.info("Order completed successfully", { userId });
}


function simulatePayment(amount) {
  if (amount > 3000) {
    throw new Error("Insufficient funds");
  }
}

function isDatabaseConnected() {
  return false; // change the return value to see the effect
}


logger.info("Application started");

checkoutOrder(101, {
  items: ["Laptop", "Mouse"],
  total: 3500
});
