# Cargon backend repository

## Installation

```bash
$ npm install
```

## Run DB
```bash
$ docker-compose -f docker-compose-local.yml up -d postgres 
```

## Setup DB (Apply Prisma migrations)
```bash
$ prisma migrate deploy
```
If you want to update the database structure, apply changes to `prisma.schema`
then run
```bash
$ prisma migrate dev --name init 
```
To clear the database and fill it with the test data run
```bash
$ prisma migrate reset 
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
