/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  '/upload-file': {
    view: 'uploadfile'  // view 'uploadfile' in views directory will loaded automatically
  },

  /**********************below is for local login *********************************/
  "/local-login": {
    view: 'login'
  },

  'get /files' : 'FileController.getfiles',
  'get /files/:fileId' : 'FileController.getFileById',
  'post /file/upload': "FileController.upload",
  'get /mediaServer/video/stream/:token': "MediaServerController.streamVideo"

  , 'get /mediaServer/image': "MediaServerController.getImages"
  , 'get /mediaServer/image/:imageId': "MediaServerController.serveImage"
  , 'post /mediaServer/image/': "ImageUploadToDBController.upload"
  , 'delete /mediaServer/image/:imageId': "ImageUploadToDBController.deleteImage"
  //, 'delete /mediaServer/image-all': "ImageUploadToDBController.deleteAllImage"

  , 'post /:tutorId/course/:courseId/:moduleId/videoUpload': 'NgFileUploadController.upload'  //"FancyUploadController.uploadCourseVideo"  //
  , 'get /courses/:id/modules': 'CourseController.getCourseModules'
  , 'get /courses': 'CourseController.getCourses'
  , 'get /courses/:id': 'CourseController.getCourseById'
  , 'get /courses/users/:userId': 'CourseController.getCoursesByTutor'
  , 'post /courses': 'CourseController.postCourse'
  , 'put /courses/:courseId': 'CourseController.putCourse'
  , 'delete /courses/:courseId': 'CourseController.deleteCourse'

  , 'get /modules': 'ModuleController.search'
  , 'post /module': 'ModuleController.create'

  , "delete /delete-video/:tutorId/:urlToken": "NgFileUploadController.deleteVideo"

  , 'get /users/:uid/watchHistory': 'WatchHistoryController.getUserWatchHistory'
  , 'get /users/:uid/watchHistory/:cid': "WatchHistoryController.getUserCourseWatchHistory"
  , 'post /users/:uid/watchHistory': 'WatchHistoryController.addUserWatchHistory'
  , 'put /users/:uid/watchHistory': 'WatchHistoryController.updateWatchHistory'

  , 'get /auth/checkUserName/:username': 'AuthController.checkUsername'
  , 'get /auth/checkEmail/:email': 'AuthController.checkEmail'
  , 'get /registration/confirm': 'AuthController.registerConfirm'

  , 'post /auth/:uid/changePassword':'AuthController.changePassword'
  , 'post /auth/register': 'AuthController.register'
  , 'post /auth/login':'AuthController.login'
  , 'post /auth/loginByUserNameOrEmail':'AuthController.loginByUserNameOrEmail'
  , 'post /auth/:uid/updateUserNameAndPassword':'AuthController.updateUserNameAndPassword'
  , 'get /test/auth': 'User.auth'

 ///************************************* book resource

  , 'get /books': 'BookController.getBooks'
  , 'get /books/:id': 'BookController.getBookById'

  //, 'get /books/:id/pages/:pageId': 'BookController.getBookPage'

  , 'post /books': 'BookController.createBook'
  , 'put /books/:id': 'BookController.updateBookById'
  , 'delete /books/:id': 'BookController.deleteBookById'
  , 'delete /users/:userId/books' : 'BookController.deleteUserBooks'
  , 'get /users/:uid/books': 'BookController.getUserBooks'

 ///************************************* book comments resource
  , 'get /books/:id/comments' : 'BookCommentController.getBookComments'
  , 'post /books/:id/comments' :'BookCommentController.createComment'
  , 'put /books/:bookId/comments/:commentId' : 'BookCommentController.updateComment'
  , 'delete /books/:bookId/comments/:commentId' : 'BookCommentController.deleteComment'

 ///************************************* book pages resource

  , 'get /books/:bookId/pages': 'BookPageController.getBookPages'
  , 'post /books/:bookId/pages': 'BookPageController.createBookPage'
  , 'get /books/:bookId/pages/:pageId':'BookPageController.getOneBookPage'
  , 'put /books/:bookId/pages/:pageId':'BookPageController.updateOneBookPage'
  , 'delete /books/:bookId/pages/:pageId':'BookPageController.deleteOneBookPage'

//,"post /upload" : "NgFileUploadController.upload"

  /*******************  below is for uploader  *******************************/
  //
  //"get /fupload-file" :{view:"fupload"},
//   "post /upload" : "FancyUploadController.upload"
  //"delete /uploaded/files/*/:name" : "FancyUploadController.delete",
  //"get /findex" :{view:"fuploadindex"},

  /**********************below is for course *********************************/


  // "post /user":"UserController.postUser"
  //  ,"get /courses" : "CourseController.getAllCourses"
  //  // get user's course
  //  "get /:userId/courses" : "CourseController.getUserCourses",
  //  "post /:userId/courses":"CourseController.postUserCourse",
  //  "get /:userId/courses/:courseId":"CourseController.getUserCourse",
  //  "put /:userId/courses/:courseId":"CourseController.putUserCourse",
  //  "delete /:userId/courses/:courseId":"CourseController.deleteUserCourse",
  //
  //  /// course module
  //  "get /:userId/courses/:courseId/modules" :"CourseSectionController.getCourseModules",
  //  "post /:userId/courses/:courseId/modules" :"CourseSectionController.postCourseModule",
  //  "get /:userId/courses/:courseId/modules/:moduleId" :"CourseSectionController.getCourseModule",
  //  "put /:userId/courses/:courseId/modules/:moduleId" :"CourseSectionController.putCourseModule",
  //  "delete /:userId/courses/:courseId/modules/:moduleId" :"CourseSectionController.deleteCourseModule",
  //
  //  /// - course section in each module
  //  "get /:userId/courses/:courseId/modules/:moduleId/sections" :"CourseSectionController.getCourseSections",
  //  "post /:userId/courses/:courseId/modules/:moduleId/sections" :"CourseSectionController.postCourseSection",
  //  "get /:userId/courses/:courseId/modules/:moduleId/sections/:sectionId" :"CourseSectionController.getCourseSection",
  //  "put /:userId/courses/:courseId/modules/:moduleId/sections/:sectionId" :"CourseSectionController.putCourseSection",
  //  "delete /:userId/courses/:courseId/modules/:moduleId/sections/:sectionId" :"CourseSectionController.deleteCourseSection",
  //
  // /// - video in each section
  // "get /:userId/courses/:courseId/videos" : "VideoController.getCourseVideos",
  // "get /:userId/courses/:courseId/sections/videos" : "VideoController.getCourseSectionVideos",
  //
  // "post /:userId/courses/:courseId/sections/:sectionId/videos" : "VideoController.uploadCourseSectionVideo",
  // "delete /:userId/courses/:courseId/sections/:sectionId/videos" : "VideoController.putSectionVideos",
  //
  ///////////////////////////////////////////////////////////////////////////////////
  //
 , "get /courses/byuser/:userId" : "CourseController.getUserCourses"
  //,"get /courses/byid/:enId": "CourseController.getCourseById"
  //
  //"get /courses/edit/:enId" : "CourseController.updateCourseById",
  //"post /courses/edit/:enId" : "CourseController.updateCourseById",
  //
  //"get /courses/:courseToken/sections/:sectionToken" : "CourseSectionController.getCourseSection",
  //
  //"get /courses/:courseToken/sections/edit/:sectionToken" : "CourseSectionController.getCourseSection",
  //
  //"get /courses/:courseToken/sections/edit/:sectionToken" : "CourseSectionController.editSection",
  //"post /courses/:courseToken/sections/edit/:sectionToken" : "CourseSectionController.editSection",
  //
  //
  //"get /create-course" : {view:"create-course"},
  //"post /create-course" : "CourseController.create",
  //
  //"get /courses-section/edit/:courseToken" : "CourseSectionController.editCourseSections",
  //"post /courses-section/edit/:courseToken" : "CourseSectionController.editCourseSections",
  //
  //"get /courses/:courseToken/create-section" :  "CourseSectionController.showCreateSectionUI",
  //"post /create-section" : "CourseSectionController.create",
  //
  //  /**********************below is for course *********************************/
  //  "get /upload-video/:token" : "FancyUploadController.showUploadUI",
  //  "post /upload-video/:token" :"FancyUploadController.uploadCourseVideo",
  //
  //  "delete /delete-video/:videoToken" :"FancyUploadController.deleteCourseVideo"


  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   *  If a request to a URL doesn't match any of the custom routes above, it  *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
