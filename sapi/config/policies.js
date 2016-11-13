/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    "JobController" :{
        "find" : ['jwtAuth']
    },

    "UserController":{
     //   "find" :['checkWritePermission'],
     //   "findOne" :['checkWritePermission']
 
     "updateUserProfile" : ['checkClientKey','jwtAuth','checkWritePermission'],
     "update":['checkClientKey','jwtAuth','checkWritePermission'],
     "destroy":['checkClientKey','jwtAuth','checkWritePermission']
    },

   "AuthController" :{
     "updateUserNameAndPassword":['checkClientKey','jwtAuth'],
     "resetPassword" : ['checkClientKey','jwtAuth','checkWritePermission'],

     "create":['checkClientKey','jwtAuth','checkWritePermission'],
     "update":['checkClientKey','jwtAuth','checkWritePermission'],
     "destroy":['checkClientKey','jwtAuth','checkWritePermission']
   },

    "VideoController" :{
        "streamVideo" :['jwtAuth'],
        "find" :['checkClientKey','jwtAuth'],
        "create":['checkClientKey','jwtAuth','checkWritePermission'],
        "update":['checkClientKey','jwtAuth','checkWritePermission'],
        "destroy":['checkClientKey','jwtAuth','checkWritePermission']
    },

   "NgFileUploadController" :{
     "find" :['checkClientKey'],
     "create":['checkClientKey','jwtAuth','checkWritePermission'],
     'deleteVideo':['checkClientKey','jwtAuth','checkWritePermission'],
     "update":['checkClientKey','jwtAuth','checkWritePermission'],
     "destroy":['checkClientKey','jwtAuth','checkWritePermission']
   },

   "ImageUploadToDBController" :{
    "find" :['checkClientKey'], 
    "upload":['checkClientKey','jwtAuth','checkWritePermission'],
     "deleteImage" :['checkClientKey','jwtAuth','checkWritePermission'],
     "create":['checkClientKey','jwtAuth','checkWritePermission'],
     'deleteVideo':['checkClientKey','jwtAuth','checkWritePermission'],
     "update":['checkClientKey','jwtAuth','checkWritePermission'],
     "destroy":['checkClientKey','jwtAuth','checkWritePermission'] 
   },

   "CourseController" :{
     'find':['checkClientKey'],
     'postCourse' :['checkClientKey','jwtAuth','checkWritePermission'],
     'putCourse':['checkClientKey','jwtAuth','checkWritePermission'],
     'deleteCourse':['checkClientKey','jwtAuth','checkWritePermission'],
     'create':['checkClientKey','jwtAuth','checkWritePermission'],
     'update':['checkClientKey','jwtAuth','checkWritePermission'],
     'destroy':['checkClientKey','jwtAuth','checkWritePermission']
   },

  "ModuleController" :{
    'find':['checkClientKey'],
    'create':['checkClientKey','jwtAuth','checkWritePermission'],
    'update':['checkClientKey','jwtAuth','checkWritePermission'],
    'destroy':['checkClientKey','jwtAuth','checkWritePermission']
  },

  "BookController" :{
    //'find':['checkClientKey'],
    //'getBookById':['checkClientKey'],
    'updateBookById':['checkClientKey','jwtAuth'],
    'deleteBookById':['checkClientKey','jwtAuth'],
    'createBook':['checkClientKey','jwtAuth'],
    'create':['checkClientKey','jwtAuth','checkWritePermission'],
    'update':['checkClientKey','jwtAuth','checkWritePermission'],
    'destroy':['checkClientKey','jwtAuth','checkWritePermission']
  },

  "BookCommentController" :{
    'createComment':['checkClientKey'],
    'deleteComment':['checkClientKey','jwtAuth'],
    'create':['checkClientKey','jwtAuth','checkWritePermission'],
    'update':['checkClientKey','jwtAuth','checkWritePermission'],
    'destroy':['checkClientKey','jwtAuth','checkWritePermission']
  }

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
