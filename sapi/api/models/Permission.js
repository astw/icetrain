/**
 * Permission.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    userid: {
      type: "string",
      required: true,
      unique: true
    },
    type: {
      type: "string",
      required: true
    }
  },

  seedData: [
    {
      "userid": "1",
      "type": "write",
      "id": 1,
      "createdAt": "2014-12-06T21:22:53.245Z",
      "updatedAt": "2014-12-06T21:22:53.245Z"
    },
    {
      "userid": "2",
      "type": "read",
      "id": 2,
      "createdAt": "2014-12-06T21:23:04.494Z",
      "updatedAt": "2014-12-06T21:23:04.494Z"
    },
    {
      "userid": "3",
      "type": "write",
      "id": 3,
      "createdAt": "2014-12-06T21:23:04.494Z",
      "updatedAt": "2014-12-06T21:23:04.494Z"
    }
  ]
};

