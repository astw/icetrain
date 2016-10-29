'use strict';

var Q = require("q");

module.exports = {
  getBookComments: getBookComments,
  createComment: createComment 
}

function getBookComments(bookId){   
    var condition = {
    	bookId:bookId
    } 
    return BookComment.find(condition).populate("author");
 }

function createComment(bookId, commentData){   
  commentData.bookId = bookId;
   return BookComment.create(commentData) 
};
 