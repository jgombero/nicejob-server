const express = require("express");
const crypto = require("crypto");

// TODO: Change the path when I publish the package to npm and install it in the project
const Database = require("../database-package/index");

require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = express();

const db = new Database({
  project_id: process.env.PROJECT_ID,
  cache_max_age: 1800,
  cache_allocated_memory: 50,
});

app.use(express.json());

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
