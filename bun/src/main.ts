import { clients } from "./setup";
import { runTests } from "./tests";

// -----------------------------------------------------------------------------
// ----- Constants -------------------------------------------------------------

const MIN_BUN_VERSION = "1.3.0";

// -----------------------------------------------------------------------------
// ----- main ------------------------------------------------------------------

const run = async () => {
  verifyBunVersion();

  await clients.connect();
  console.log("Clients ready");

  await runTests(clients);

  await clients.teardown();
  console.log("Teardown completed");
};

await run();

// -----------------------------------------------------------------------------
// ----- Helpers: Version Check ------------------------------------------------

function verifyBunVersion() {
  const requiresBunUpdate = !isVersionAtLeast(MIN_BUN_VERSION);

  if (requiresBunUpdate) {
    console.error(
      `bun ${Bun.version} is too old; require >= ${MIN_BUN_VERSION}`,
    );

    process.exit(1);
  }
}

function isVersionAtLeast(minimum: string) {
  const version = Bun.version;

  const [vmaj, vmin, vpatch] = parseVersion(version);
  const [rmaj, rmin, rpatch] = parseVersion(minimum);

  if (vmaj !== rmaj) return vmaj > rmaj;
  if (vmin !== rmin) return vmin > rmin;

  return vpatch >= rpatch;
}

function parseVersion(version: string) {
  const [major = "0", minor = "0", patch = "0"] = version
    .split("-")[0]
    .split(".");

  return [Number(major), Number(minor), Number(patch)] as const;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
