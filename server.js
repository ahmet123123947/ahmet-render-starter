import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

// JSON body parse (10 MB limit)
app.use(express.json({ limit: "10mb" }));

// ---------------------------------------------
// 1) Terminal Komut Sistemi (/exec)
// ---------------------------------------------
app.get("/exec", (req, res) => {
  const cmd = req.query.cmd;

  if (!cmd) {
    return res.json({ error: "cmd parameter required" });
  }

  exec(cmd, { timeout: 20000 }, (error, stdout, stderr) => {
    res.json({
      cmd,
      error: error?.message || null,
      stdout,
      stderr
    });
  });
});

// ---------------------------------------------
// 2) Dosya Yazma Sistemi (/writeFile)
// AI → Cloud’a kod yazabilir
// ---------------------------------------------
app.post("/writeFile", (req, res) => {
  const { path, content } = req.body;

  if (!path || content === undefined) {
    return res.json({ error: "path and content required" });
  }

  fs.writeFile(path, content, "utf8", (err) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json({ success: true, path });
  });
});

// ---------------------------------------------
// 3) Dosya Okuma Sistemi (/readFile)
// ---------------------------------------------
app.get("/readFile", (req, res) => {
  const path = req.query.path;

  if (!path) {
    return res.json({ error: "path parameter required" });
  }

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json({ success: true, path, content: data });
  });
});

// ---------------------------------------------
// Test endpoint
// ---------------------------------------------
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", cloud: "render" });
});

// ---------------------------------------------
// Start server
// ---------------------------------------------
app.listen(port, () => {
  console.log("Server running on port", port);
});
