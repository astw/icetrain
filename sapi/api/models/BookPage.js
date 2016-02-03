/**
 * MediaFile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    size:{
      type:'integer'
    },

    width:{
      type:'integer'
    },

    height:{
      type:'integer'
    },

    data :{
      type:"string"
    },

    book:{
      model: 'Book'
    }
  }
};
