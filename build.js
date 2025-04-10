const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// Các file cần build
const buildFiles = [
  { entry: "src/uv.bundle.js", outfile: "dist/uv.bundle.js" },
  { entry: "src/uv.client.js", outfile: "dist/uv.client.js" },
  { entry: "src/uv.handler.js", outfile: "dist/uv.handler.js" },
  { entry: "src/uv.sw.js", outfile: "dist/uv.sw.js" },
];

for (const file of buildFiles) {
  esbuild.buildSync({
    entryPoints: [file.entry],
    bundle: true,
    platform: "browser", // Cái này quan trọng
    target: "es2020",
    outfile: file.outfile,
    sourcemap: true,
  });
}

// Copy config
fs.copyFileSync("src/uv.config.js", "dist/uv.config.js");

// Copy index.html và style.css nếu có
fs.copyFileSync("static/index.html", "dist/index.html");
if (fs.existsSync("static/style.css")) {
  fs.copyFileSync("static/style.css", "dist/style.css");
}
