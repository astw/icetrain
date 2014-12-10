/**
 * CourseSectionController
 *
 * @description :: Server-side logic for managing coursesections
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var urlQuery = require('url');
var courseidKey ="sec for construct course id";
var sectionKey ="sec for construct couse section id";
var Hashids = require("hashids"),
    couseHashids = new Hashids(courseidKey),
    sectionHashids = new Hashids(sectionKey);

module.exports = {

  showCreateSectionUI:function(req, res){
    var courseToken = req.params.courseToken;
    res.view("create-section",{courseToken:courseToken});
  },

  create: function (req, res) {
        if (req.method === 'GET')
            return res.json({'status': 'GET not allowed'});

        console.log(req.body);
        var token = urlQuery.parse(req.url,true).query.token;
        var ids = couseHashids.decode(token);
        var courseId = ids[0];
        var tutorId = ids[1];

        CourseSection.create({
            title: req.body.sectionTitle,
            desc: req.body.sectionDesc,
            courseid: courseId,
            tutorid:tutorId,
            tags: req.body.sectionTags
            }, function (err, data) {
                if (err != null) {
                    res.writeHead(400, {"Location": "/error"})
                };

                token = couseHashids.encode([tutorId,courseId,data.id]);
                res.redirect("/upload-video/"+ token );
                res.end();
        });
    }
}
