import { ensureEnvLoaded, validateEnv } from "./env.mjs";

function getModeFromArgs() {
  const modeArg = process.argv
    .slice(2)
    .find((arg) => arg.startsWith("--mode="));

  return modeArg?.split("=")[1] || "app";
}

const mode = getModeFromArgs();

await ensureEnvLoaded();

const { errors, warnings } = validateEnv(mode);

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }

  console.error("Copy .env.example to .env and fill in the required values.");
  process.exit(1);
}

console.log(`Environment check passed for ${mode} mode.`);
