

var associateCourseRepository = require("../services/courseRepository/associateCourseRepository.js");

module.exports = {
  getCourseById : associateCourseRepository.getCourseById,
  getCourseModules: associateCourseRepository.getCourseComplexModules,
  create: associateCourseRepository.createCourse
};
