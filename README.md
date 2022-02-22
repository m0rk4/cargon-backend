## Description

####Cargon backend repository

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
$ npx prisma migrate dev --name init 
```
If you want to update the database structure, apply changes to `prisma.schema`
then run
```bash
$ npx prisma migrate dev --name init 
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
