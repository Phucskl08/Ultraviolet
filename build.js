import esbuild from "esbuild";
import { copyFileSync, mkdirSync, readdirSync, lstatSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { publicPath } from "Ultraviolet";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Tạo thư mục dist nếu chưa có
mkdirSync("dist", { recursive: true });

// Build uv.client.js
await esbuild.build({
  entryPoints: ["uv.client.js"],
  bundle: true,
  outfile: "dist/uv.client.js",
  minify: true,
});

// Build uv.bundle.js
await esbuild.build({
  entryPoints: ["uv.bundle.js"],
  bundle: true,
  outfile: "dist/uv.bundle.js",
  minify: true,
});

// Sao chép index.html và các file public khác
function copyRecursive(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  });
}

copyRecursive(publicPath, "dist");
console.log("✅ Build completed and public files copied!");
