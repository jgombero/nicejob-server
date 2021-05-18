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
    healthcheck.message = e.message;
    res.status(503).send(healthcheck);
  }
});

app.get("/:collection", async (req, res) => {
  const { collection } = req.params;
  const { limit = 10 } = req.query;
  const filters = req.body;

  try {
    const document = await db.readMany({ collection }, filters);

    res.json(document.slice(0, limit));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;

  try {
    const document = await db.readOne({ collection, id });

    res.json(document);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/:collection", async (req, res) => {
  const { collection } = req.params;
  const document = req.body;
  let id = crypto.randomBytes(12).toString("base64");
  id = id.replace("/", "-");

  try {
    await db.write({ collection, id }, document);

    res.json(document);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const document = req.body;

  try {
    await db.write({ collection, id }, document);

    res.json(document);
  } catch (error) {
    res.send(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT} 🚀`);
});
