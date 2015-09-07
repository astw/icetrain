var Q = require('q');
var associateCourseRepository = require("../services/courseRepository/associateCourseRepository.js");

var getTranslationSearchCondition = function(key) {
  var condition = {};
  condition.or = [];
  //condition.or.push({name: new RegExp(key)});
  //condition.or.push({desc: new RegExp(key)});
  //condition = {name:{'like': '%'+ key + '%'}};
  condition.or.push({name:{'like': '%'+ key + '%'}});
  condition.or.push({desc:{'like': '%'+ key + '%'}});
  console.log(JSON.stringify(condition));
  return condition;
};

module.exports = {

  getCourses:function(req,res) {
    var searchTerm = req.param('searchTerm');
    if (!searchTerm) {
      searchTerm = req.param('searchterm');
    }
    if (!searchTerm) {
      searchTerm = req.param('search-term');
    }

    if(searchTerm == undefined){
      searchTerm='';
    }

    console.log(searchTerm);

    var condition = getTranslationSearchCondition(searchTerm);
    associateCourseRepository.searchCourse(condition).then(
      function(courses){
        console.log(courses);
        res.status(200).send(courses);
      },
      function(err){
        res.status(500).send(err);
      });
  },
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

  putCourse: associateCourseRepository.updateCourseById,

  deleteCourse:function(req,res){
    console.log(req.params);

    var courseId = req.params.courseId;
    console.log(req.session);
    Course.findOne({id:courseId})
      .then(function(course){
        console.log(course);
         if(course.tutor == req.session.userid){
           course.destroy().then(function(result){
             console.log(result);
             return res.status(200).send({"status":"200","message":"deleted"})
           })
           .fail(function(err){
               return res.status(500).send({"status":"500","message":err})
             });
         }
        else{
           return res.status(401).send({"status":401,"message":"You cannot delete other people's course."});
         }
    })
      .error(function(err){
          return res.serverError();
      });

    //if(req.session.userid !== )
    Course.destroy({id:courseId}).exec(function(err,data){
      if(err){
        return res.serverError();
      }
      return res.status(200).send(data);
    });
  }
};
