# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Database Scripts

This project uses Prisma as the ORM for database management. Here's what each database script does:

### `bun run db:generate`
**Command:** `prisma generate`

Generates the Prisma Client based on your Prisma schema. This creates type-safe database client code that matches your database schema. Run this whenever you:
- Make changes to your `schema.prisma` file
- Add new models or modify existing ones
- Change field types or relationships

### `bun run db:studio`
**Command:** `prisma studio`

Opens Prisma Studio, a visual database browser in your web browser. This GUI tool allows you to:
- View and edit your database records
- Explore table relationships
- Test queries visually
- Manage data without writing SQL

### `bun run db:migrate`
**Command:** `prisma migrate dev`

Creates and applies database migrations in development. This command:
- Generates a new migration file based on schema changes
- Applies the migration to your development database
- Regenerates the Prisma Client automatically
- Use this when you want to save schema changes as versioned migrations

### `bun run db:push`
**Command:** `prisma db push`

Pushes schema changes directly to the database without creating migration files. This is useful for:
- Rapid prototyping during development
- Making quick schema changes that don't need to be versioned
- Syncing schema changes to development databases
- **Note:** Use with caution in production as it doesn't create migration history

### `bun run db:seed`
**Command:** `bun run prisma/seeds/index.ts`

Runs the database seeding script to populate your database with initial or test data. This typically:
- Creates default users, roles, or configuration data
- Populates lookup tables with reference data
- Generates sample data for development and testing
- **Note:** The seed script is located at `prisma/seeds/index.ts`

### `bun run db:reset`
**Command:** `prisma migrate reset`

Resets the entire database by:
- Dropping all tables and data
- Re-running all migrations from scratch
- Regenerating the Prisma Client
- Optionally running seed scripts
- **Warning:** This destroys all data - only use in development!

## Environment Configuration

You can use different `.env` files for different environments with these Prisma commands using the `--env-file` flag:

```bash
# Use staging environment
bun run --env-file=.env.staging db:migrate
bun run --env-file=.env.staging db:studio
bun run --env-file=.env.staging db:push

# Use test environment
bun run --env-file=.env.test db:reset
bun run --env-file=.env.test db:seed

# Use production environment
bun run --env-file=.env.production db:migrate
```

### Environment File Examples

**.env.development**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/myapp_dev"
```

**.env.staging**
```env
DATABASE_URL="postgresql://user:pass@staging-host:5432/myapp_staging"
```

**.env.test**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/myapp_test"
```

**.env.production**
```env
DATABASE_URL="postgresql://user:pass@prod-host:5432/myapp_prod"
SHADOW_DATABASE_URL="postgresql://user:pass@prod-host:5432/myapp_shadow"
```

### Important Notes

- **Production migrations**: Use `prisma migrate deploy` instead of `prisma migrate dev` for production
- **Shadow database**: Required for production migrations when using cloud databases
- **Environment isolation**: Always verify you're connected to the correct database before running destructive commands
- **CI/CD**: Use environment-specific scripts in your deployment pipelines

## Typical Development Workflow

1. **Initial setup:** `bun run db:generate` → `bun run db:migrate` → `bun run db:seed`
2. **Schema changes:** Modify `schema.prisma` → `bun run db:migrate`
3. **Quick prototyping:** Modify `schema.prisma` → `bun run db:push`
4. **Data exploration:** `bun run db:studio`
5. **Fresh start:** `bun run db:reset`
6. **Testing:** `bun run --env-file=.env.test db:reset` → `bun run --env-file=.env.test db:seed`
7. **Staging deployment:** `bun run --env-file=.env.staging db:migrate`



