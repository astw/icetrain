/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mediaService = require("../services/mediaServer/mediaService.js");
var mediaTokenHelper = require("../services/tokenHelper.js");

module.exports = {
	streamVideo:  mediaService.playVideo,
  streamImage:  mediaService.serveImage,
  getImages: mediaService.getImages,
  serveImage:mediaService.serveImage

};

