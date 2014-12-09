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

    create: function (req, res) {
        if (req.method === 'GET')
            return res.json({'status': 'GET not allowed'});

        console.log(req.body);
        var token = urlQuery.parse(req.url,true).query.token;

        var courseid = couseHashids.decode(token)[0];
        var tutorid = couseHashids.decode(token)[1];

        CourseSection.create({
            title: req.body.sectionTitle,
            desc: req.body.sectionDesc,
            courseid: courseid,
            tutorid:tutorid,
            tags: req.body.sectionTags
            }, function (err, data) {
                if (err != null) {
                    res.writeHead(400, {"Location": "/error"})
                };
                var sectionToken = sectionHashids.encode(data.id);
                var courseToken = sectionHashids.encode(courseid);
                res.redirect("/upload-video/"+ courseToken +"/" + sectionToken );
                res.end();
        });
    }
}
