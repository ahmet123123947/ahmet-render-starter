import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// === STATIC PANEL ===
app.use(express.static(path.join(__dirname, "public")));

// === TEST API ===
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", cloud: "render" });
});

// === EXEC TERMINAL ===
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

// === READ FILE ===
app.get("/readFile", (req, res) => {
  const fs = await import("fs");
  const pathFile = req.query.path;

  if (!pathFile) return res.json({ error: "path required" });

  try {
    const content = fs.readFileSync(pathFile, "utf8");
    res.json({ success: true, path: pathFile, content });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// === WRITE FILE ===
app.post("/writeFile", async (req, res) => {
  const fs = await import("fs");
  const { path: filePath, content } = req.body;

  if (!filePath) return res.json({ error: "path required" });

  try {
    fs.writeFileSync(filePath, content);
    res.json({ success: true, path: filePath });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
