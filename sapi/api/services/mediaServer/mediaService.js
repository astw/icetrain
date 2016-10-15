var mediaTokenHelper = require("../tokenHelper.js");

var fs = require('fs'),
    util = require('util');

var path = require("path");
var root = require('app-root-path')+"";

var cache = Object();  // {}

module.exports =  {

      getImages : function(req,res){

       var details = req.param('details');
       var category = req.param('cat');
       var condition = {};
       if(category === 'background' || category ==='props' || category ==='bigText'
         || category ==='text' ||category==='personal' || category ==='page'){
         condition = {
           category:category
         }
       }

       Media.find(condition, {select:['id','tag','category','width','height','contentType','fileSize']}).then(function(images){
         var imageLinks = images.map(function(image){
           var url = 'mediaServer/image/'+ image.id;

           if(details) {
             return {
               link: url + '?size=origin',
               thumb: url,
               tag: image.tag,
               category: image.category,
               width: image.width,
               height: image.height,
               format: image.contentType,
               size:image.fileSize
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
       var imageId = req.param('imageId');
       var width = req.param('width');
       var height = req.param('height');
       var imageSize = req.param('size');

       Media.findOne({id: imageId}).populateAll()
         .then(function (file) {

           if(!file){
            console.log('not found ');
             return res.notFound();
           }

           var base64Image = file.data;

           if(imageSize && imageSize ==='origin'){
             console.log('to get origin size');
             console.log(file.originFile);

              var originFile = file.mediaFile;
              if(originFile)
              base64Image = originFile.data;
           }

           var img = new Buffer(base64Image, 'base64');

           res.writeHead(200,{
             "Content-Type": file.contentType,
             "Content-Length": img.length
           });

           res.end(img);
         },
         function (err) {
           res.serverError(err);
         })
     },

     playVideo :function(req, res) {

       var token = req.params.token;
       var range = req.headers.range;
       var positions = range.replace(/bytes=/,"").split("-");
       var start =parseInt(positions[0],10);

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
