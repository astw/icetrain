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

 '/upload-file':{
    view: 'uploadfile'  // view 'uploadfile' in views directory will loaded automatically
  },

  'get /mediaServer/video/stream/:token'  :"VideoController.streamVideo",


   /*******************  below is for uploader  *******************************/
   //
   //"get /fupload-file" :{view:"fupload"},
   //"post /upload" : "FancyUploadController.upload",
   //"delete /uploaded/files/*/:name" : "FancyUploadController.delete",
   //"get /findex" :{view:"fuploadindex"},

  /**********************below is for course *********************************/
  "get /courses/byuser/:courseToken" : "CourseController.getUserCourses",
  "get /courses/byid/:courseToken": "CourseController.getCourseById",
  "get /courses/:courseToken/sections/:sectionToken" : "CourseSectionController.getCourseSections",

  "get /create-course" : {view:"create-course"},
  "post /create-course" : "CourseController.create",

  "get /courses-section/edit/:courseToken" : "CourseSectionController.editCourseSections",
  "post /courses-section/edit/:courseToken" : "CourseSectionController.editCourseSections",

  "get /courses/:courseToken/create-section" :  "CourseSectionController.showCreateSectionUI",
  "post /create-section" : "CourseSectionController.create",

    /**********************below is for course *********************************/

    "get /upload-video/:courseToken" : "FancyUploadController.showUploadUI",
    "post /upload-video/:courseToken" :"FancyUploadController.uploadCourseVideo",

    "delete /delete-video/:videoToken" :"FancyUploadController.deleteCourseVideo"
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
