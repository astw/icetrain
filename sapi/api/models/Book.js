/**
* CourseSection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title: {
      type: "string",
      required: true,
      minLength: 5,
      maxLength: 200
    },

    titleFont: {
      type: "string"
    },

    titleColor: {
      type: "string"
    },

    attribution: {
      type: 'string'
    },

    attributionFont: {
      type: 'string'
    },

    attributionColor: {
      type: 'string'
    },

    backgroundColor: {
      type: 'string'
    },

    desc: {
      type: "string"
    },

    fontCoverImageIndex: {
      type: "integer"
    },

    backCoverImageIndex: {
      type: "integer"
    },

    dedication: {
      type: "string"
    },

    dedicationColor:{
      type:'string'
    },

    dedicationFont:{
      type:'string'
    },

    pageCount: {
      type: "integer"
    },

    author: {
      model: "User"
    },

    rate: {
      type: "integer",
      defaultsTo: 0
    },

    openToAll: {
      type: "boolean",
      defaultsTo: true
    },

    data: {
      type: "string"
    },

    comments:{
      collection: "BookComment",
      via: "book"
    },

    pages:{
      collection:"BookPage",
      via:"book"
    }
  }
};

