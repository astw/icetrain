var mediaTokenHelper = require("../mediaTokenHelper.js");

var fs = require('fs'),
    util = require('util');

var path = require("path")
var root = require('app-root-path')+"";

var cache = Object();  // {}

module.exports =  {

     playVideo :function(req, res){

        var token = req.params.token;
        var mediaInfo = mediaTokenHelper.getVideoInfo(token);
        if(!mediaInfo){
            res.end("");
        }

        var url = mediaInfo.path;

        var data = cache[url];

        if(data == null)
        {
            console.log("root=" + root);
            console.log(url);
            var mediaPath= path.join(root,url);
            console.log( mediaPath );

            fs.readFile(mediaPath, function (err, data) {
                if (err) {
                    throw err;
                }
                cache[url] = data;
                res.writeHead(200, { 'Content-Length': data.length, 'Content-Type': 'video/mp4' });
                res.end(data);
            });
        }
         else{
            res.writeHead(200, { 'Content-Length': data.length, 'Content-Type': 'video/mp4' })
            res.end(data);
        }
    }
}
