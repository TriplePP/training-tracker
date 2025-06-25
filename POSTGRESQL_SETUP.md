# PostgreSQL Setup Guide

This document provides instructions for setting up and using PostgreSQL with this project.

## Local Development with Docker

For local development, we use a PostgreSQL database running in Docker:

```bash
# Start the PostgreSQL container
docker-compose up -d
```

The connection string for local development is:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/training_tracker?schema=public"
```

## Production Environment with Neon PostgreSQL

For production, we use Neon PostgreSQL, a serverless PostgreSQL service:

### Connection Strings

```
# Recommended for most uses (with connection pooling)
DATABASE_URL="postgres://neondb_owner:npg_j6MFb9tygiLs@ep-snowy-sun-ab2gm228-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_j6MFb9tygiLs@ep-snowy-sun-ab2gm228.eu-west-2.aws.neon.tech/neondb?sslmode=require"
```

### Connection Parameters

```
PGHOST=ep-snowy-sun-ab2gm228-pooler.eu-west-2.aws.neon.tech
PGHOST_UNPOOLED=ep-snowy-sun-ab2gm228.eu-west-2.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_j6MFb9tygiLs
```

## Database Migrations

To run database migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

## Seeding the Database

To seed the database with initial data:

```bash
# Run the seed SQL file
cat src/prisma/seed.sql | docker exec -i training-tracker-postgres-1 psql -U postgres -d training_tracker
```

For production:

```bash
# Connect to Neon SQL Editor and run the seed.sql file
```

## Vercel Deployment

The project is configured to automatically run migrations during the build process on Vercel:

```json
// vercel.json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

This ensures that the database schema is always up to date with the latest code.
