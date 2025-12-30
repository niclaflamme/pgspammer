.PHONY: run run\:bun check-bun

run: run\:bun

run\:bun: check-bun
	cp .env bun/.env
	cd bun && bun run src/main.ts

check-bun:
	./scripts/check-bun-version.sh 1.3.0
