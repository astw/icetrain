var Q = require('q');

var getBookSearchCondition = function(key) {
  var condition = {};
  condition.or = [];

  condition.or.push({title:{'contains':  key }});
  //condition.or.push({desc:{'contains':  key }});

  //condition.or.push({desc:{'like': '%'+ key + '%'}});
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

    //------- test canvas at nodejs
    // var Canvas = require('canvas')
    //   , Image = Canvas.Image
    //   , canvas = new Canvas(200, 200)
    //   , ctx = canvas.getContext('2d');

    // ctx.font = '30px Impact';
    // ctx.rotate(.1);
    // ctx.fillText("Awesome!", 50, 100);

    // var te = ctx.measureText('Awesome!');
    // ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    // ctx.beginPath();
    // ctx.lineTo(50, 102);
    // ctx.lineTo(50 + te.width, 102);
    // ctx.stroke();

    // console.log('<img src="' + canvas.toDataURL() + '" />');


    //-------------
    var authorid = req.param('authorid')||req.param('author');
    var title = req.param('title');

    var condition ={};
    if(authorid) {
      condition = {author: authorid};
    }

    var condition2 =  {} ;
    if (title){
      condition2 = getBookSearchCondition(title);
    }

    bookRepository.getBooks(condition,condition2).then(
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

  deleteUserBooks: function(req, res){
    var userId = req.param('userId');
    bookRepository.deleteUserBooks(userId)
      .then(function(){
        return res.ok('deleted');
      })
      .catch(function(err){
        return res.badRequest(err);
      }).done()
  },

  deleteBookById:function(req,res){
    var id = req.param('id');

    bookRepository.getBookById(id).then(
      function(book){ 
        if(book.author.id == req.session.userid){
          bookRepository.deleteBookById(id).then(
            function(result){ 
              return res.status(200).send({"status":"200","message":"deleted"})
           },
            function(err){
              console.log('delete fails', err);
              return res.status(500).send(err);
            }
          )
            .fail(function(err){
              console.log('fails',err);
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
