# PostgreSQL Setup Guide

This project uses PostgreSQL as the database, with Prisma as the ORM. The database is hosted on Vercel with Prisma Accelerate for production, but you can run it locally using Docker for development.

## Environment Variables

The project uses the following environment variables for database connection:

- `DATABASE_URL`: The connection string for Prisma Accelerate
- `DIRECT_DATABASE_URL`: The direct connection string to PostgreSQL (used for migrations)

These are already set up in the `.env` and `.env.development` files.

## Local Development with Docker

1. Make sure you have Docker and Docker Compose installed on your machine.

2. Start the PostgreSQL container:

```bash
docker-compose up -d
```

This will start a PostgreSQL server on port 5432 with the following credentials:

- Username: postgres
- Password: postgres
- Database: training_tracker

3. Update your `.env.development.local` file to use the local PostgreSQL instance for direct connections:

```
DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/training_tracker?schema=public"
```

4. Run migrations to set up your database schema:

```bash
npx prisma migrate dev
```

5. Seed the database with initial data (if needed):

```bash
npx prisma db seed
```

## Connecting to the Database

You can connect to the database using tools like pgAdmin, TablePlus, or Postico using the `@prisma/ppg-tunnel` package.

## Troubleshooting

If you encounter any issues with the database connection:

1. Make sure the Docker container is running:

```bash
docker ps
```

2. Check the logs of the PostgreSQL container:

```bash
docker logs training-tracker-postgres
```

3. Ensure your environment variables are correctly set up.

4. Try restarting the Docker container:

```bash
docker-compose down
docker-compose up -d
```
