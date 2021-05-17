const express = require("express");
const crypto = require("crypto");

const Database = require("@jgombero/database-package");

require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

const db = new Database({
  project_id: process.env.PROJECT_ID,
  cache_max_age: 3600,
  cache_allocated_memory: 64,
});

app.use(express.json());

app.get("/healthcheck", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

app.get("/:collection", async (req, res) => {
  const { collection } = req.params;
  const { limit = 10 } = req.query;
  const filters = req.body;

  const document = await db.readMany({ collection }, filters);

  res.json(document.slice(0, limit));
});

app.get("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;

  const document = await db.readOne({ collection, id });

  res.json(document);
});

app.post("/:collection", async (req, res) => {
  const { collection } = req.params;
  const document = req.body;
  const id = crypto.randomBytes(12).toString("base64");

  await db.write({ collection, id }, document);

  res.json(document);
});

app.post("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const document = req.body;

  await db.write({ collection, id }, document);

  res.json(document);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT} 🚀`);
});
