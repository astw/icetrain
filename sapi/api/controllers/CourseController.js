

var associateCourseRepository = require("../services/courseRepository/associateCourseRepository.js");

module.exports = {
  getCourseById : associateCourseRepository.getCourseById,
  getCoursesByTutor:function(req,res){
    associateCourseRepository.getCoursesByTutor(req,res)
      .then(function(courses){
        res.status(200).send(courses);
    })
      .error(function(err){
        res.status(500).send(err);
      })
  },
  getCourseModules: associateCourseRepository.getCourseComplexModules,
  postCourse: associateCourseRepository.createCourse,
  putCourse:associateCourseRepository.updateCourseById
};
