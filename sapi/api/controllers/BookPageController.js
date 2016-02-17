

module.exports = {
  getBookPages:getBookPages,
  getOneBookPage:getOneBookPage,
  createBookPage:createBookPage,
  updateOneBookPage:updateOneBookPage,
  deleteOneBookPage:deleteOneBookPage
}

function createBookPage(req,res) {
  var pageData = req.body;

  var pageInfo = {
    size: pageData.size,
    width: pageData.width,
    height: pageData.height,
    data: pageData.data,
    book: pageData.book
  }

  bookPageRepository.createOneBookPage(pageInfo)
    .then(
    function(page){
       return res.ok(page);
    },

    function(err){
      console.log('create page error=',err);
      res.badRequest(err);
    }
  )
}

function getBookPages(req, res) {
  var bookId = req.param('bookId');
  bookRepository.getBookPages(bookId)
    .then(function (pages) {
      if (pages && pages.length > 0) {
        return res.ok(pages);
      }
      return res.notFound();
    },
    function (err) {
      console.log('rejected info in controller', err);
    })
    .catch(function(err){
      return res.serverErrror(err);
    })
    .done();
}

function getOneBookPage(req, res) {

  var bookId = req.param('bookId');
  var pageId = req.param('pageId');

  bookRepository.getBookPages(bookId, pageId)
    .then(function (page) {
      if (page)
        return res.ok(page);
      else
        return res.notFound();
    },

    function (err) {
      console.log('get one page page....');
      return res.serverError(err);
    }
  )
}

function updateOneBookPage(req, res) {

  var pageInfo = req.body;

  bookRepository.updateBookPage(pageInfo)
    .then(function(updated){
      console.log('updated page info', pageInfo);
      return res.ok(pageInfo);
    },
    function(err){
      console.log('update fails....', err);
      return res.serverEror(err);
    }
  ).catch(function(err){

      console.log('update error in catch....');
      return res.serverEror(err);
    })

}

function deleteOneBookPage(req, res) {

}
