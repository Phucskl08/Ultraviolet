import { rimraf } from "rimraf";
import { copyFile, mkdir, readdir, stat, writeFile, readFile } from "node:fs/promises";
import { join } from "path";
import { build } from "esbuild";
import { execSync } from "node:child_process";

// Đọc version từ package.json
const pkg = JSON.parse(await readFile("package.json"));
process.env.ULTRAVIOLET_VERSION = pkg.version;

const isDevelopment = process.argv.includes("--dev");

// Xoá thư mục dist nếu đã tồn tại và tạo lại
await rimraf("dist");
await mkdir("dist");

// Copy các file không cần compile
await copyFile("src/uv.sw.js", "dist/uv.sw.js");
await copyFile("src/uv.config.js", "dist/uv.config.js");

// Build các file bằng esbuild
let builder = await build({
  platform: "browser",
  sourcemap: true,
  minify: !isDevelopment,
  entryPoints: {
    "uv.bundle": "./src/rewrite/index.js",
    "uv.client": "./src/client/index.js",
    "uv.handler": "./src/uv.handler.js",
    "uv.sw": "./src/uv.sw.js",
  },
  define: {
    "process.env.ULTRAVIOLET_VERSION": JSON.stringify(pkg.version),
    "process.env.ULTRAVIOLET_COMMIT_HASH": (() => {
      try {
        return JSON.stringify(
          execSync("git rev-parse --short HEAD", {
            encoding: "utf-8",
          }).trim()
        );
      } catch {
        return JSON.stringify("unknown");
      }
    })(),
  },
  bundle: true,
  treeShaking: true,
  metafile: isDevelopment,
  logLevel: "info",
  outdir: "dist/",
});

// Nếu dev thì ghi file metafile
if (isDevelopment) {
  await writeFile("metafile.json", JSON.stringify(builder.metafile));
}

// Copy toàn bộ thư mục static (gồm index.html) vào dist
async function copyRecursive(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

await copyRecursive("static", "dist");
console.log("✅ Build hoàn tất và đã copy static (index.html) vào dist!");
