# pgspammer

pgcrab is a Postgres proxy, sharder, and multiplexer with compatible APIs.

pgspammer is a companion repo meant to hammer a pgcrab instance with simple,
repeatable queries. It is a mono repo with multiple client implementations so
you can compare behavior across runtimes or run them side-by-side.

The goal is sustained load: each client runs an infinite loop and you should run
three separate processes to keep pressure on pgcrab.

## Repo layout

```
pgspammer/
  bun/
  rust/
  go/
  python/
```

Each sub-repo is standalone and can be run independently.
