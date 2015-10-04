/**
* OrderItems.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id: {
      type: 'integer',
      primaryKey: 'true'
    },

    cart:{
      model:"Cart",
      required:true
    },

    product:{
      model:"Product"
    },

    amount:{
      type:"decimal",
      defaultsTo:0.00
    }
  },
  seedData: []
}