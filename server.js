import express from "express";
import { exec } from "child_process";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/test", (req, res) => {
  res.json({ status: "ok", cloud: "render" });
});

app.get("/run", (req, res) => {
  exec("ls -la", (error, stdout, stderr) => {
    res.json({
      error: error?.message,
      stdout,
      stderr,
    });
  });
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
