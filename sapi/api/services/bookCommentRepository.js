'use strict';

var Q = require("q");

module.exports = {
  getBookComments: getBookComments,
  createComment: createComment,
  updateComment: updateComment,
  deleteComment: deleteComment
}

function deleteComment(currentUserId, commentId){
	console.log('currentUserId=', currentUserId);
	console.log("id to delete:", commentId); 

	return BookComment.destroy({author:currentUserId, id:commentId});
}

function getBookComments(bookId){   
    var condition = {
    	bookId:bookId
    } 
    return BookComment.find(condition).limit(50).sort({updatedAt:'desc'}).populate("author");
 }

function createComment(bookId, commentData){   
   var  data = {
   	    bookId:bookId,
   	    ip:commentData.ip,
   	    comment:commentData.comment,
   	    author:commentData.author,
   	    host:commentData.host,
   	    origin:commentData.origin

   }
   return BookComment.create(data) 
};
 
function updateComment(commentData){ 

  var defer = Q.defer();
  
  //return BookComment.update({id:commentData.commentId}, {complainedTimes: this.complainedTimes + 1 })
  
   BookComment.findOne({id:commentData.commentId}).
    then(function(comment){
      if(!comment){
      	comment.complainedTimes =0;
      }
      var commentToUpdate = {  
		 complainedTimes:comment.complainedTimes += 1
       }

      comment.save(commentToUpdate, function(err, updatedComment){
        if(err){ 
          return defer.reject(err);
        }

        defer.resolve(commentToUpdate)
      })
    }); 

    return defer.promise;  
}