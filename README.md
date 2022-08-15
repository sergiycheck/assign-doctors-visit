## Installation

```bash
$ npm install
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

## Environment variables

```env
PORT=4023
POPULATE=1
MONDB_DB_CONN_STR='mongodb://serhii:serhii_pass@localhost:27018/assign-doctors-visit-db?authMechanism=DEFAULT&authSource=admin'
QUEUE_HOST='localhost'
QUEUE_PORT=6380
```

### Change ownership in case of errors with docker compose up

```bash
sudo chown -R dev mongo_datadir
```

where **dev** is the name of the current user

```bash
sudo chown -R dev redis_storage
```

[Persist cron jobs stackoverflow question with answer](https://stackoverflow.com/questions/36568096/persist-my-cron-jobs-and-execute-them-even-if-my-node-server-restarted)

- [agenda](https://github.com/agenda/agenda) mongoddb
- [bree](https://github.com/breejs/bree) redis
- [bull](https://github.com/OptimalBits/bull)
- nodejs-persistable-scheduler (mysql persistence)
- [node-schedule](https://github.com/node-schedule/node-schedule#readme)
- [nestjs queues with bull](https://docs.nestjs.com/techniques/queues)
- [timestamp-converter](http://www.timestamp-converter.com/)
- [nest js issue about custom nest-cli-prefill.json](https://github.com/nestjs/nest-cli/issues/452)
