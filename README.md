# pgspammer

pgspammer is a companion repo for pgcrab (Postgres proxy/sharder/multiplexer)
that hammers a pgcrab instance with simple, repeatable queries. It is a mono
repo with multiple client implementations so you can compare behavior across
runtimes or run them side-by-side.

The goal is sustained load: each client runs an infinite loop and you should
run multiple separate processes to keep pressure on pgcrab.

## Repo layout

```
pgspammer/
  bun/
  rust/
  go/
  python/
```

Each sub-repo is standalone and can be run independently.

## TODOs

These are intentionally acknowledged here so we do not lose track of them.

- Add per-client run instructions and consistent CLI flags across runtimes.
- Define a shared query set and workload profiles (duration, concurrency).
- Add optional metrics output (latency/throughput) and simple reports.
- Add smoke tests and CI to validate each client starts and runs.

## Long-term vision

Make pgspammer the easy way to test many clients: a single command that can
spin up a matrix of client runtimes, run a standardized query mix, and compare
behavior or performance side-by-side.
