
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
  console.log(bookData);
  Book.create({
    title : bookData.title,
    titleFont:bookData.titleFont,
    titleColor:bookData.titleColor,
    attribution:bookData.attribution,
    attributionFont:bookData.attributionFont,
    attributionColor:bookData.attributionColor,
    backgroundColor:bookData.backgroundColor,
    frontCover:bookData.frontCover,
    frontCoverWidth:bookData.frontCoverWidth,
    frontCoverHeigth:bookData.frontCoverHeight,
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
    var defers = [];
    bookData.pages.forEach(function(page){
      console.log(page);
      //var canvas = fabric.canvas;
      //var fabric = require('fabric').fabric;
    });

    return defer.resolve(book);
  });

  return defer.promise;
};

var updateBookById = function (bookId, dataToUpdate) {
  var defer = Q.defer();
  console.log(dataToUpdate.title);
  Book.findOne({id: bookId})
    .then(function (book) {
      console.log('-------------- new book.frontCoverImageIndex-----------');
      console.log(dataToUpdate.frontCoverImageIndex);
      console.log('data length=',dataToUpdate.data.length);

      book.title = dataToUpdate.title || book.title;
      book.titleFont = dataToUpdate.titleFont || book.titleFont;
      book.titleColor = dataToUpdate.titleColor || book.titleColor;
      book.attribution = dataToUpdate.attribution || book.attribution;
      book.attributionFont = dataToUpdate.attributionFont || book.attributionFont;
      book.attributionColor = dataToUpdate.attributionColor || book.attributionColor;
      book.backgroundColor = dataToUpdate.backgroundColor || book.backgroundColor;
      book.frontCoverWidth = dataToUpdate.frontCoverWidth || book.frontCoverWidth;
      book.frontCover = dataToUpdate.frontCover;
      book.frontCoverHeight = dataToUpdate.frontCoverHeight || book.frontCoverHeight;
      book.frontCoverImageIndex = dataToUpdate.frontCoverImageIndex || book.frontCoverImageIndex;
      book.backColorImageIndex = dataToUpdate.backColorImageIndex || book.backColorImageIndex;
      book.dedication = dataToUpdate.dedication || book.dedication,
      book.dedicationFont = dataToUpdate.dedicationFont || book.dedicationFont,
      book.dedicationColor = dataToUpdate.dedicationColor || book.dedicationColor,
      book.desc = dataToUpdate.desc || book.desc;
      book.rate = dataToUpdate.rate || book.rate;
      book.data = dataToUpdate.data || book.data;
      book.openToAll = dataToUpdate.openToAll || book.openToAll;
      book.pageCount = dataToUpdate.totalPage || book.totalPage;
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
