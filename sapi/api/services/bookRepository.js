
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

var createBook = function(data) {
  var defer = Q.defer();

  Book.create({
    title : data.title,
    desc : data.desc,
    rate : data.rate,
    data : data.data,
    openToAll : data.openToAll,
    pages :data.totalPage,
    author:data.author
  }, function (err, data) {
    if (err) {
      return  defer.reject(err);
    };

    return defer.resolve(data);
  });

  return defer.promise;
};

var updateBookById = function (courseId, dataToUpdate) {
  var defer = Q.defer();
  Book.findOne({id: courseId})
    .then(function (book) {
      book.title = dataToUpdate.title || book.title;
      book.desc = dataToUpdate.desc || book.desc;
      book.rate = dataToUpdate.rate || book.rate;
      book.data = dataToUpdate.data || book.data;
      book.openToAll = dataToUpdate.openToAll || book.openToAll;
      book.pages = dataToUpdate.pages || book.pages;
      book.save();
      defer.resolve(book);
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
  var defer = Q.defer();
  Book.destroy({id: bookId}).exec(function (err, book) {
    if (err) {
      return defer.reject(500);
    }

    return defer.resolve(200);
  });

  return defer.promise;
};

module.exports = {
  getBooks: getBooks,
  createBook: createBook,
  updateBookById: updateBookById,
  getBookById: getBookById,
  deleteBookById: deleteBookById
}
