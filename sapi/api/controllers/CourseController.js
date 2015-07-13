

var associateCourseRepository = require("../services/courseRepository/associateCourseRepository.js");

module.exports = {
  getCourseById : associateCourseRepository.getCourseById,
  getCoursesByTutor:associateCourseRepository.getCoursesByTutor,
  getCourseModules: associateCourseRepository.getCourseComplexModules,
  postCourse: associateCourseRepository.createCourse,
  putCourse:associateCourseRepository.updateCourseById
};
