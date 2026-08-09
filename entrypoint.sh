#!/bin/sh
set -e

npx tsx database/initDB.ts

exec "$@"