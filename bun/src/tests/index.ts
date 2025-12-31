import { type ClientRegistry } from "../setup/clients";
import { runSimpleSelects } from "./0001_simple_selects";
import { runParseCacheHitRate } from "./0002_parse_cache_hit_rate";

// -----------------------------------------------------------------------------
// ----- runTests --------------------------------------------------------------

export async function runTests(clients: ClientRegistry) {
  const shouldAbort = verifyClientAvailability(clients);
  if (shouldAbort) {
    console.log("Required clients are not available, aborting tests.");
    return;
  }

  console.log("Running tests...");

  await runSimpleSelects(clients);
  await runParseCacheHitRate(clients);

  console.log("Done");
}

// -----------------------------------------------------------------------------
// ---- Heplers ----------------------------------------------------------------

function verifyClientAvailability(clients: ClientRegistry) {
  let shouldAbort = false;

  if (clients.bun === null) {
    console.warn("Bun client is not available.");
    shouldAbort = true;
  }

  if (clients.pg === null) {
    console.warn("pg client is not available.");
    shouldAbort = true;
  }

  if (clients.postgres === null) {
    console.warn("postgres client is not available.");
    shouldAbort = true;
  }

  return shouldAbort;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
