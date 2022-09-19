const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { ObjectId } = require('mongodb');

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      _id: new ObjectId('62f5522152f2a42df2e203d3'),
    },
  },
  {
    $lookup: {
      from: 'slots',
      localField: 'slots',
      foreignField: '_id',
      as: 'slots',
    },
  },
  {
    $unwind: {
      path: '$slots',
    },
  },
  {
    $match: {
      $and: [
        {
          'slots._id': {
            $eq: new ObjectId('62f5522152f2a42df2e203dd'),
          },
        },
        {
          'slots.free': {
            $eq: true,
          },
        },
      ],
    },
  },
];

MongoClient.connect(
  'mongodb://serhii:serhii_pass@localhost:27018/assign-doctors-visit-db?authMechanism=DEFAULT&authSource=admin',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db('assign-doctors-visit-db').collection('doctors');
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  },
);
