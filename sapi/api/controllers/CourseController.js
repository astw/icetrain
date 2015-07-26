

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
  putCourse:associateCourseRepository.updateCourseById,
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
