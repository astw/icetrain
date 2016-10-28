
var Q = require("q");

var getBookById = function (bookId) {
  var defer = Q.defer();
   Book.findOne({id: bookId}).populateAll()
    .then(
    function (book) {
      defer.resolve(book);
    },
    function (err) {
      defer.reject(err);
    }
  );
  return defer.promise;
};

var createBook = function(bookData) {
  var defer = Q.defer(); 
  Book.create({
    title : bookData.title,
    titleFont:bookData.titleFont,
    titleColor:bookData.titleColor,
    attribution:bookData.attribution,
    attributionFont:bookData.attributionFont,
    attributionColor:bookData.attributionColor,
    backgroundColor:bookData.backgroundColor,
    frontCover:bookData.frontCover,
    backCover :bookData.backCover,
    dedicatedPage :bookData.dedicatedPage,
    frontCoverImageIndex:bookData.frontCoverImageIndex,
    backCoverImageIndex:bookData.backCoverImageIndex,
    dedication:bookData.dedication,
    dedicationFont:bookData.dedicationFont,
    dedicationColor:bookData.dedicationColor,
    desc : bookData.desc,
    rate : bookData.rate,
    data : bookData.data,
    openToAll : bookData.openToAll,
    pages :bookData.totalPage,
    author:bookData.author
  }, function (err, book) {
    if (err) {
      return  defer.reject(err);
    };

    // for each page, create a page record in database, and return the page id back
    //var defers = [];
    //bookData.pages.forEach(function(page){ 
      //var canvas = fabric.canvas;
      //var fabric = require('fabric').fabric;
    //});

    return defer.resolve(book);
  });

  return defer.promise;
};

var updateBookById = function (bookId, dataToUpdate) {
  var defer = Q.defer(); 
  Book.findOne({id: bookId})
    .then(function (book) { 

      book.title = dataToUpdate.title ;
      book.titleFont = dataToUpdate.titleFont ;
      book.titleColor = dataToUpdate.titleColor;
      book.attribution = dataToUpdate.attribution ;
      book.attributionFont = dataToUpdate.attributionFont;
      book.attributionColor = dataToUpdate.attributionColor;
      book.backgroundColor = dataToUpdate.backgroundColor;
      book.frontCoverWidth = dataToUpdate.frontCoverWidth;
      book.frontCoverHeight = dataToUpdate.frontCoverHeight;
      book.frontCover = dataToUpdate.frontCover;
      book.backCover = dataToUpdate.backCover;
      book.dedicatedPage = dataToUpdate.dedicatedPage;

      book.frontCoverImageIndex = dataToUpdate.frontCoverImageIndex;
      book.backColorImageIndex = dataToUpdate.backColorImageIndex;
      book.dedication = dataToUpdate.dedication;
      book.dedicationFont = dataToUpdate.dedicationFont;
      book.dedicationColor = dataToUpdate.dedicationColor;
      book.desc = dataToUpdate.desc;
      book.rate = dataToUpdate.rate;
      book.data = dataToUpdate.data;
      book.openToAll = dataToUpdate.openToAll;
      book.pageCount = dataToUpdate.totalPage;
      book.save(function(err){
        if(err){
          console.log(err);
          defer.reject(err);
        }
        defer.resolve(book);
      });
    },

    function(err){
      defer.reject(err);
    }
  );

  return defer.promise;
};

var getBooks = function(condition,condition2) {
  var defer = Q.defer();

  var promise = Book.find(condition);
  if(condition2){
    promise = Book.find(condition).where(condition2);
  }

  promise.then(
    function (books) {
      defer.resolve(books);
    },
    function (err) {
      defer.reject(err);
    });

  return defer.promise;
};

var deleteBookById = function(bookId) {
  return Book.destroy({id:bookId})
};

var deleteUserBooks = function(userId) {
  return deleteBook({author:userId});
};

function deleteBook(condition){
  var defer = Q.defer();
  Book.destroy( condition ).exec(function(err){
    if(err){
      return defer.reject(500);
    }

    return defer.resolve();
  });

  return defer.promise;
}

module.exports = {
  getBooks: getBooks,
  createBook: createBook,
  updateBookById: updateBookById,
  getBookById: getBookById,
  deleteBookById: deleteBookById,
  deleteUserBooks:deleteUserBooks
}
