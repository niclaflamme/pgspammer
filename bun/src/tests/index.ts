import { type ClientRegistry } from "../setup/clients";

export async function runTests(clients: ClientRegistry) {
  if (!clients.bun || !clients.pg || !clients.postgres) {
    console.log("Clients are not properly connected.");
    return;
  }

  console.log("Running tests...");

  await sleep(1000); // Simulate async test operations, remove soon

  console.log("Done");
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
