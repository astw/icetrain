

module.exports = {
  getBookPages:getBookPages,
  getOneBookPage:getOneBookPage,
  updateOneBookPage:updateOneBookPage,
  deleteOneBookPage:deleteOneBookPage
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
