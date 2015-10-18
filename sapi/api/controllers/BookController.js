var Q = require('q');
var associateCourseRepository = require("../services/courseRepository/associateCourseRepository.js");

var getBookSearchCondition = function(key) {
  var condition = {};
  condition.or = [];
  //condition.or.push({title: new RegExp(key)});
  //condition.or.push({desc: new RegExp(key)});
  // ;
  condition.or.push({title:{'like': '%'+ key + '%'}});
  condition.or.push({desc:{'like': '%'+ key + '%'}});
  return condition;
};

module.exports = {

  getUserBooks:function(req,res){
    var userId = req.param('uid');

    bookRepository.getBooks({author:userId}).then(
      function(books){
        res.status(200).send(books);
      },
      function(err){
        res.status(500).send(err);
      });
  },

  getBooks:function(req,res) {
    var searchTerm = req.param('searchTerm');
    if (!searchTerm) {
      searchTerm = req.param('searchterm');
    }
    if (!searchTerm) {
      searchTerm = req.param('search-term');
    }

    if(searchTerm == undefined){
      searchTerm='';
    }

    var condition = getBookSearchCondition(searchTerm);
    bookRepository.getBooks(condition).then(
      function(books){
        res.status(200).send(books);
      },
      function(err){
        res.status(500).send(err);
      });
  },
  getBookById : function(req,res){
    var id = req.param('id');
    bookRepository.getBookById(id).then(
      function(book){
        return res.status(200).send(book);
      },
      function(err){
        return res.status(404);
    })
  },
  updateBookById : function(req,res){
    var id = req.param('id');
    var data = req.body;
    bookRepository.updateBookById(id,data).then(
      function(book){
        return res.status(200).send(data);
      },
      function(err){
        return res.status(404);
      })
  },
  deleteBookById:function(req,res){
    var id = req.param('id');
    bookRepository.getBookById(id).then(
      function(book){
        if(book.author == req.session.userid){
          bookRepository.deleteBookById(id).then(
            function(result){
               console.log(result);
              return res.status(200).send({"status":"200","message":"deleted"})
          },
            function(err){
              return res.status(500).send(err);
            }
          )
            .fail(function(err){
               return res.status(500).send({"status":"500","message":err})
            });
        }
        else{
          return res.status(401).send({"status":401,"message":"You cannot delete other people's books."});
        }
    });
  },
  createBook:function(req,res) {
    var data = req.body;
    console.log(req.session.userid);
    data.author = req.session.userid;
    bookRepository.createBook(data).then(
      function (d) {
        res.status(200).send(d);
      },
      function (e) {
        res.status(400).send(e);
      })
  }
};
