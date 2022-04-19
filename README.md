# Cargon backend repository

## Installation

```bash
$ npm install
```

## Run DB
```bash
$ docker-compose -f docker-compose-local.yml up -d postgres 
```

## Run Test DB
```bash
$ docker-compose -f docker-compose-local.yml up -d postgres-test 
```

## Setup DB (Apply Prisma migrations)
```bash
$ prisma migrate deploy
```
If you want to update the database structure, apply changes to `prisma.schema`
then run
```bash
$ prisma migrate dev --name ${NAME_OF_THE_MIGRATION} 
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
Before running tests make sure test container is up.

$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
