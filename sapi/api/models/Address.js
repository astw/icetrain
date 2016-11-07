/**
* Address.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user: {
      model: "User"
    },

    addressType: {
      type: "string",
      enum: ["billingAddress", "shippingAddress"],
      defaultsTo: "shippingAddress"
    },

    defaultAddress: {
      type: "boolean",
      defaults: false
    },
    province: {
      type: "string",
      required: true,
      maxLength: 200
    },

    city: {
      type: "string",
      required: true,
      maxLength: 200
    },

    addressLine1: {
      type: 'string',
      required: true,
      maxLength: 300
    },

    addressLine2: {
      type: 'string',
      required: false,
      maxLength: 300
    },

    email: {
      type: 'email'
    },

    userName: {
      type: 'string'
    },

    phone: {
      type: 'string'
    },

    postCode: {
      type: 'string'
    }
  },
  seedData: []
}
