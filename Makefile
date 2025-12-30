.PHONY: run\:bun

run\:bun:
	cp .env bun/.env
	cd bun && bun run src/main.ts
