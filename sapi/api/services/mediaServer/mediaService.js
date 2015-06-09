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

       var data = cache[token];
       if (data == null) {
         Video.findOne({urltoken: token}).then(function (video) {
           var mediaPath = video.path;

           console.log(video);
           console.log("root=" + root);
           var mediaPath= path.join(root,mediaPath);
           console.log( mediaPath );

           fs.readFile(mediaPath, function (err, data) {
             if (err) {
               throw err;
             }
             cache[token] = data;
             res.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'video/mp4'});
             res.end(data);
           });
         })
       }
       else {
         res.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'video/mp4'});
         res.end(data);
       }
     }
};
