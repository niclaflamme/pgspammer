import { type ClientRegistry } from "../setup/clients";

// -----------------------------------------------------------------------------
// ----- Constants -------------------------------------------------------------

const SERIES_MAX = 1000;
const PARAM_VALUE = 5;

// -----------------------------------------------------------------------------
// ----- runSimpleSelects ------------------------------------------------------

export async function runSimpleSelects(clients: ClientRegistry) {
  const { bun, pg, postgres } = requireClients(clients);

  await Promise.all([
    runBunQueries(bun),
    runPostgresQueries(postgres),
    runPgQueries(pg),
  ]);
}

// -----------------------------------------------------------------------------
// ----- Bun -------------------------------------------------------------------

async function runBunQueries(client: NonNullable<ClientRegistry["bun"]>) {
  await client`select 1`;
  await client`select generate_series(1, ${SERIES_MAX})`;
  await client`select ${PARAM_VALUE} + generate_series(1, ${PARAM_VALUE})`;
}

// -----------------------------------------------------------------------------
// ----- postgres --------------------------------------------------------------

async function runPostgresQueries(
  client: NonNullable<ClientRegistry["postgres"]>,
) {
  await client`select 1`;
  await client`select generate_series(1, ${SERIES_MAX})`;
  await client`select ${PARAM_VALUE} + generate_series(1, ${PARAM_VALUE})`;
}

// -----------------------------------------------------------------------------
// ----- pg --------------------------------------------------------------------

async function runPgQueries(client: NonNullable<ClientRegistry["pg"]>) {
  await client.query("select 1");
  await client.query("select generate_series(1, $1)", [SERIES_MAX]);
  await client.query("select $1 + generate_series(1, $1)", [PARAM_VALUE]);
}

// -----------------------------------------------------------------------------
// ----- Heplers ---------------------------------------------------------------

function requireClients(clients: ClientRegistry) {
  const { bun, pg, postgres } = clients;

  if (!bun || !pg || !postgres) {
    throw new Error("Clients are not connected.");
  }

  return { bun, pg, postgres };
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
