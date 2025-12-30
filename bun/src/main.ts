import { clients } from "./setup";
import { runTests } from "./tests";

const run = async () => {
  await clients.connect();
  console.log("Clients ready");

  await runTests(clients);

  await clients.teardown();
  console.log("Teardown completed");
};

await run();
