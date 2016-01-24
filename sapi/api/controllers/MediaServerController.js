
var mediaService = require("../services/mediaServer/mediaService.js");
module.exports = {
	streamVideo:  mediaService.playVideo,
  streamImage:  mediaService.serveImage,
  getImages: mediaService.getImages,
  serveImage:mediaService.serveImage

};

