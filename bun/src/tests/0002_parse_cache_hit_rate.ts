import { type ClientRegistry } from "../setup/clients";

// -----------------------------------------------------------------------------
// ----- Constants -------------------------------------------------------------

const QUERY_COUNT = 10000;
const BATCH_SIZE = 20;

// -----------------------------------------------------------------------------
// ----- runSimpleSelects ------------------------------------------------------

export async function runParseCacheHitRate(clients: ClientRegistry) {
  const { bun, pg, postgres } = requireClients(clients);

  await Promise.all([
    runBunQueries(bun),
    runPostgresQueries(postgres),
    runPgQueries(pg),
  ]);
}

// -----------------------------------------------------------------------------
// ----- Bun -------------------------------------------------------------------

type BunClient = NonNullable<ClientRegistry["bun"]>;

async function runBunQueries(client: BunClient) {
  for (let i = 0; i < QUERY_COUNT; i += BATCH_SIZE) {
    const queries = [];

    for (let j = i; j < Math.min(i + BATCH_SIZE, QUERY_COUNT); j++) {
      queries.push(client`
        WITH users AS (
          SELECT ${j} AS user_id
        )
        SELECT user_id FROM users
      `);
    }

    await Promise.all(queries);
  }
}

// -----------------------------------------------------------------------------
// ----- postgres --------------------------------------------------------------

type PostgresClient = NonNullable<ClientRegistry["postgres"]>;

async function runPostgresQueries(client: PostgresClient) {
  for (let i = 0; i < QUERY_COUNT; i += BATCH_SIZE) {
    const queries = [];

    for (let j = i; j < Math.min(i + BATCH_SIZE, QUERY_COUNT); j++) {
      queries.push(client`
        WITH users AS (
          SELECT ${j} AS user_id
        )
        SELECT user_id FROM users
      `);
    }

    await Promise.all(queries);
  }
}

// -----------------------------------------------------------------------------
// ----- pg --------------------------------------------------------------------

type PgClient = NonNullable<ClientRegistry["pg"]>;

async function runPgQueries(client: PgClient) {
  for (let i = 0; i < QUERY_COUNT; i += BATCH_SIZE) {
    const queries = [];

    for (let j = i; j < Math.min(i + BATCH_SIZE, QUERY_COUNT); j++) {
      queries.push(
        client.query(
          "WITH users as (SELECT $1 as user_id) SELECT user_id from users",
          [j],
        ),
      );
    }

    await Promise.all(queries);
  }
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
