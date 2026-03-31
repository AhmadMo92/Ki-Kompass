import { build } from "esbuild";
import { execSync } from "child_process";
import fs from "fs";

console.log("Building frontend with Vite...");
execSync("vite build", { stdio: "inherit" });

console.log("Bundling server with esbuild...");
await build({
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/server.js",
  packages: "external",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

fs.writeFileSync("dist/index.cjs", `import("./server.js");\n`);

console.log("Build complete.");
