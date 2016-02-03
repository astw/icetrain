var mediaTokenHelper = require("../tokenHelper.js");

var fs = require('fs'),
    util = require('util');

var path = require("path")
var root = require('app-root-path')+"";

var cache = Object();  // {}

module.exports =  {

     getImages : function(req,res){

       var details = req.param('details');
       var category = req.param('cat');
       var condition = {};
       if(category === 'background' || category ==='props' || category ==='text'){
         condition = {
           category:category
         }
       }

       Media.find(condition).then(function(images){
         var imageLinks = images.map(function(image){
           var url = 'mediaServer/image/'+ image.enId();

           if(details) {
             return {
               link: url + '?size=origin',
               thumb: url,
               tag: image.tag,
               category: image.category,
               width: image.width,
               height: image.height,
               format: image.format
             }
           }
           else {
             return {
               link: url + '?size=origin',
               thumb: url
             };
           }
         });
         res.ok(imageLinks);
       })
     },

     serveImage:function(req,res) {

       // by default, serve thumb images
       var imageId = req.params.imageId;
       var id = mediaTokenHelper.getImageId(imageId)[0];
       var width = req.param('width');
       var height = req.param('height');
       var imageSize = req.param('size');

       Image.findOne().where({id: id})
         .then(function (image) {
           var mediaPath = image.path;
           if(imageSize && (imageSize =='origin')){
             mediaPath = path.join(root,'media', 'images','fullsize', image.category, mediaPath);
           } else {
             mediaPath = path.join(root,'media', 'images','thumb', image.category, mediaPath);
           }

           res.writeHead(206, {
             "Content-Type": image.format
           });

           var stream = fs.createReadStream(mediaPath)
             .on("open", function () {
               stream.pipe(res);
             }).on("error", function (err) {
               res.end(err);
             });
         },

         function (err) {
           res.end(err);
         })
     },

     playVideo :function(req, res) {

       var token = req.params.token;
       console.log(token);

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
               res.statusCode = 500;
               res.writeHead(500, err);
               res.end(err);
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
