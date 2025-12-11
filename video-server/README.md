# Video Platform API

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Lint files

```bash
# analyze files
$ npm run lint

# fix files
$ npm run lint:fix
```

## Run with Docker Compose

Create the video platform containers:

```bash
# Build images if do not exist or reuse existing
$ docker compose up -d --scale video-processor=2

# ... or build new images when files change
$ docker compose up -d --build --scale video-processor=2
```

View logs from all video platform containers:

```bash
$ docker compose logs -f
```

Stop the video platform containers:

```bash
$ docker compose stop
```

Start the video platform containers:

```bash
$ docker compose start
```

Remove the video platform containers:

```bash
$ docker compose down
```

Generate migration:

```bash
$ npx prisma migrate dev
```

Apply migrations to the database:

```bash
$ npx prisma migrate deploy
```

Generate Prisma client:

```bash
$ npx prisma generate
```
