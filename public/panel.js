const BASE = window.location.origin;

// Terminal çalıştır
function runCmd() {
  const c = document.getElementById("cmd").value;
  fetch(`${BASE}/exec?cmd=` + encodeURIComponent(c))
    .then(r => r.json())
    .then(d => {
      document.getElementById("terminal").textContent =
        "Komut: " + d.cmd + "\n\n" +
        (d.stdout || "") +
        (d.stderr || "");
    });
}

// Dosya oku
function readFile() {
  const path = document.getElementById("readPath").value;
  fetch(`${BASE}/readFile?path=` + encodeURIComponent(path))
    .then(r => r.json())
    .then(d => {
      document.getElementById("fileContent").textContent = d.content || d.error;
    });
}

// Dosya yaz
function writeFile() {
  const path = document.getElementById("writePath").value;
  const content = document.getElementById("writeContent").value;

  fetch(`${BASE}/writeFile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, content })
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("writeResult").textContent =
      JSON.stringify(d, null, 2);
  });
}
