/**
* Order.js
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

    orderId:{
      type:'string',
      required:'true',
      unique:true
    },

    user: {
      model: "User",
      required:"true"
    },

    address: {
       model:"Address"
    },

    status:{
      type:"string",
      enum: ["created", "paid", "cancelled", "printing", "deliverying", "delivered","finished"],
      defaultsTo: ""
    },

    orderItems:{
      collection: "OrderItem",
      via: "order"
    },

    amount:{
      type:"decimal",
      defaultsTo:0.00
    }
  },
  seedData: []
}
