/**
* Cart.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoPK:false,
  attributes: {
    id:{
      type:'integer',
      primaryKey:true,
      autoIncrement:true,
      columnName:'cartId'
      },

    user: {
      model: "User",
      required:"true"
    },

    status:{
      type:"string",
      enum: ["valid", "invalid"],
      defaultsTo: "valid"
    },

    cartItems:{
      collection: "CartItem",
      via: "cart"
    },

    amount:{
      type:"decimal",
      defaultsTo:0.00
    }
  },
  seedData: []
}
