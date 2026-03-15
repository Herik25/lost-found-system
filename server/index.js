const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

require("dotenv").config();

const helmet = require("helmet");
const xss = require("xss-clean");
const apiLimiter = require("./middlewares/rateLimitMiddleware");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Required for serving images correctly securely
app.use(express.json());

// Workaround for xss-clean req.query getter mutation bug
app.use((req, res, next) => {
  if (req.query) {
    const q = req.query;
    Object.defineProperty(req, 'query', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: q
    });
  }
  next();
});

app.use(xss());
app.use("/api", apiLimiter);
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("ASA Lost & Found API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});