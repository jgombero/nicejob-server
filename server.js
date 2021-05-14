const express = require("express");

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

app.get("/:collection", (req, res) => {
  const { collection } = req.params;
  const { limit } = req.query;
});

app.get("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
});

app.post("/:collection", (req, res) => {
  const { collection } = req.params;
});

app.post("/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  const document = req.body;

  await db.write({ collection, id }, document);

  res.json("Entry added!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT} 🚀`);
});
