var Q = require('q');

 
module.exports = {

  getBookComments:function(req,res){
    var bookId = req.param('id'); 
    bookCommentRepository.getBookComments(bookId).then(
      function(coments){
        res.status(200).send(coments);
      })
      .catch(  
      function(err){
        res.status(500).send(err);
      });
  }, 
  
  createComment:function(req,res) {
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
};
