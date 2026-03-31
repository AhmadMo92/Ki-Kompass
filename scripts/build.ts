import { build } from "esbuild";
import { execSync } from "child_process";

console.log("Building frontend with Vite...");
execSync("vite build", { stdio: "inherit" });

console.log("Bundling server with esbuild...");
await build({
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "dist/index.cjs",
  packages: "external",
});

console.log("Build complete.");
