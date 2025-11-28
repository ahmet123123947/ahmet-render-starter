import express from "express";
import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ------------------------------
// PUBLIC PANEL SERVE (ÖNEMLİ)
// ------------------------------
const publicPath = path.join(__dirname, "public");
console.log("Serving static from:", publicPath);
app.use(express.static(publicPath));

// ------------------------------
// TEST ENDPOINT
// ------------------------------
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", cloud: "render" });
});

// ------------------------------
// EXEC (TERMINAL)
// ------------------------------
app.get("/exec", (req, res) => {
  const cmd = req.query.cmd;
  if (!cmd) return res.json({ error: "cmd parameter required" });

  exec(cmd, { timeout: 20000 }, (error, stdout, stderr) => {
    res.json({
      cmd,
      error: error?.message || null,
      stdout,
      stderr,
    });
  });
});

// ------------------------------
// READ FILE
// ------------------------------
app.get("/readFile", (req, res) => {
  const p = req.query.path;
  if (!p) return res.json({ error: "path required" });

  try {
    const content = readFileSync(p, "utf8");
    res.json({ success: true, path: p, content });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ------------------------------
// WRITE FILE
// ------------------------------
app.post("/writeFile", (req, res) => {
  const { path: p, content } = req.body;
  if (!p) return res.json({ error: "path required" });

  try {
    writeFileSync(p, content);
    res.json({ success: true, path: p });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ------------------------------
// SERVER START
// ------------------------------
app.listen(port, () => {
  console.log("Server running on port", port);
});
app.get("/debug-static", (req, res) => {
  res.json({
    publicFolder: publicPath,
    files: require("fs").readdirSync(publicPath)
  });
});
