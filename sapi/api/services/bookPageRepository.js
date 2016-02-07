var q = require('q');

module.export = new BookPageRepo;

function BookPageRepo(){

}

BookPageRepo.prototype.createOneBookPage = createOneBookPage;
BookPageRepo.prototype.getBookPages = getBookPages;
BookPageRepo.prototype.getOneBookPage = getOneBookPage;
BookPageRepo.prototype.updateOneBookPage = updateOneBookPage;
BookPageRepo.prototype.deleteOneBookPage = deleteOneBookPage;

function getBookPages(bookId){

  return BookPage.find({book:bookId});
}

function getOneBookPage(pageId){
  return BookPage.findOne({id:pageId});
}

function updateOneBookPage(pageId, pageInfo){

  var defer = q.defer();

  BookPage.findOne({id:pageId}).
    then(function(page){

      page.size = pageInfo.size || page.size;
      page.width = pageInfo.width || page.width;
      page.height = pageInfo.height || page.height;
      page.data = pageInfo.data || page.data;

      page.save(page, function(err, updatedPage){
        if(err){
          console.log('update page fails', err);
          return defer.reject(err);
        }

        defer.resolve(updatedPage)
      })
    },
  function(err){
    return defer.reject(err);
  });
}

function createOneBookPage(pageInfo) {

  var deferred = q.defer();
  // insert in batch
  BookPage.create(pageInfo).then(
    function (data) {
      deferred.resolve(data)
    },
    function (err) {
      deferred.reject(err);
    }
  )
    .error(function (err) {
      deferred.reject(err)
    });

  return deferred.promise;
}

function deleteOneBookPage(pageId){
  return BookPage.destroy({id:pageId});
}
