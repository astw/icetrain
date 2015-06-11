var mediaTokenHelper = require("../tokenHelper.js");

var fs = require('fs'),
    util = require('util');

var path = require("path")
var root = require('app-root-path')+"";

var cache = Object();  // {}

module.exports =  {

     playVideo :function(req, res) {

       var token = req.params.token;
       console.log(token);
       //var mediaInfo = mediaTokenHelper.getVideoInfo(token);
       //if(!mediaInfo){
       //  res.end("");
       // console.log(mediaInfo);
       //var url = mediaInfo.path;

       var range = req.headers.range;
       var positions = range.replace(/bytes=/,"").split("-");
       var start =parseInt(positions[0],10);

       console.log(range);
       var data = cache[token];
       data = null;
       if (data == null) {
         Video.findOne({urltoken: token}).then(function (video) {
           var mediaPath = video.path;

           console.log(video);
           console.log("root=" + root);
           var mediaPath= path.join(root,mediaPath);
           console.log( mediaPath );

         //  fs.readFile(mediaPath, function (err, data) {
           fs.stat(mediaPath, function(err, stats) {
             if (err) {
               throw err;
             }

             var total = stats.size;
             var end = positions[1] ? parseInt(positions[1],10) : total -1;
             var chunksize = (end - start) + 1;

             res.writeHead(206, {
               "Content-Range": "bytes " + start + "-" + end + "/" + total,
               "Accept-Ranges": "bytes",
               "Content-Length": chunksize,
               "Content-Type": "video/mp4"
             });

             var stream = fs.createReadStream(mediaPath, { start: start, end: end })
               .on("open", function() {
                 stream.pipe(res);
               }).on("error", function(err) {
                 res.end(err);
               });

             //cache[token] = data;
             //res.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'video/mp4'});
             //res.end(data);
           });
         })
       }
       else {
         res.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'video/mp4'});
         res.end(data);
       }
     }
};
