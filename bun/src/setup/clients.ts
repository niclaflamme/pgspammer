import { SQL } from "bun";
import pg from "pg";
import postgres from "postgres";

// -----------------------------------------------------------------------------
// ----- Contants --------------------------------------------------------------

const POOL_SIZE = 2;

// -----------------------------------------------------------------------------
// ----- Setup -----------------------------------------------------------------

type PostgresClient = ReturnType<typeof postgres>;

type ConnectedClients = {
  bun: SQL | null;
  pg: pg.Pool;
  postgres: PostgresClient;
};

export type ClientRegistry = {
  bun: SQL | null;
  pg: pg.Pool | null;
  postgres: PostgresClient | null;
  connect: () => Promise<ConnectedClients>;
  teardown: () => Promise<void>;
};

const getConnectionString = (): string => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return connectionString;
};

// Documentation: https://bun.sh/docs/api/sql
const bunSqlAvailable = typeof SQL === "function";

const createBunClient = (connectionString: string): SQL => {
  if (!bunSqlAvailable) {
    throw new Error("Bun SQL is not available in this runtime.");
  }

  return new SQL(connectionString, {
    max: POOL_SIZE,
    idleTimeout: 30, // seconds
  });
};

// Documentation: https://github.com/porsager/postgres
const createPostgresClient = (connectionString: string): PostgresClient =>
  postgres(connectionString, {
    max: POOL_SIZE,
    idle_timeout: 30, // seconds
  });

// Documentation: https://node-postgres.com/apis/pool
const createPgClient = (connectionString: string): pg.Pool =>
  new pg.Pool({
    connectionString,
    max: POOL_SIZE,
    idleTimeoutMillis: 30000, // 30 seconds (in ms)
  });

const warmupPgPool = async (pool: pg.Pool): Promise<void> => {
  const client = await pool.connect();
  client.release();
};

const warmupPostgres = async (client: PostgresClient): Promise<void> => {
  await client`select 1`;
};

// -----------------------------------------------------------------------------
// ----- Exports ----------------------------------------------------------------

export const clients: ClientRegistry = {
  bun: null,
  pg: null,
  postgres: null,
  connect: async () => {
    if (clients.bun && clients.pg && clients.postgres) {
      return {
        bun: clients.bun,
        pg: clients.pg,
        postgres: clients.postgres,
      };
    }

    const connectionString = getConnectionString();

    if (!clients.bun && bunSqlAvailable) {
      clients.bun = createBunClient(connectionString);
      await clients.bun.connect();
    }

    if (!clients.postgres) {
      clients.postgres = createPostgresClient(connectionString);
      await warmupPostgres(clients.postgres);
    }

    if (!clients.pg) {
      clients.pg = createPgClient(connectionString);
      await warmupPgPool(clients.pg);
    }

    return {
      bun: clients.bun,
      pg: clients.pg!,
      postgres: clients.postgres!,
    };
  },
  teardown: async () => {
    const tasks: Promise<void>[] = [];

    if (clients.bun) {
      tasks.push(clients.bun.close());
    }

    if (clients.postgres) {
      tasks.push(clients.postgres.end());
    }

    if (clients.pg) {
      tasks.push(clients.pg.end());
    }

    await Promise.all(tasks);

    clients.bun = null;
    clients.pg = null;
    clients.postgres = null;
  },
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
