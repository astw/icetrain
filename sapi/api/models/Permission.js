/**
 * Permission.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    user: {
      model:"User"
    }, 
 
    type: {
      type: "string",
      required: true
    }
  },

  seedData: [
    {
      "userid": "1",
      "type": "write"
    },
    {
      "userid": "2",
      "type": "read" 
    },
    {
      "userid": "3",
      "type": "write" 
    }
  ]
};

