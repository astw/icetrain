var Q = require('q');
 
module.exports = {
  getBookComments:getBookComments,
  createComment:createComment,
  updateComment:updateComment,
  deleteComment:deleteComment 
};

function deleteComment(req,res){
   var bookId = req.param('bookId'); 
   var commentId = req.param('commentId');   

   req.session.userid  
   bookCommentRepository.deleteComment(req.session.userid , commentId)
   .then(function(deletedComment){
      res.status(200).send(deletedComment);
   })
   .catch(function(err){
      res.status(500).send(err);
   })
}

function updateComment(req,res){ 
   var bookId = req.param('bookId'); 
   var commentId = req.param('commentId');  
   var data = req.body; 
   data.bookId = bookId; 
   data.commentId = commentId

   bookCommentRepository.updateComment(data)
   .then(function(newComment){
      res.status(200).send(newComment);
   })
   .catch(function(err){
      res.status(500).send(err);
   })
}

function getBookComments(req,res){
    var bookId = req.param('id'); 
    bookCommentRepository.getBookComments(bookId).then(
      function(coments){
        res.status(200).send(coments);
      })
      .catch(  
      function(err){
        res.status(500).send(err);
      });
}; 

function createComment(req,res){ 
    var data = req.body; 
    var bookId = req.param('id');  

    data.ip = req.ip;
    data.host = req.headers.host;
    data.origin = req.headers.origin;
    bookCommentRepository.createComment(bookId,data).then(
      function (d) {
        res.status(200).send(d);
      })
      .catch(
      function (e) {
        res.status(400).send(e);
      })
  } 