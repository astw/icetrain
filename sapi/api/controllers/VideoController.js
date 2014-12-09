/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mediaService = require("../services/mediaServer/mediaService.js");
var mediaTokenHelper = require("../services/mediaTokenHelper.js");

module.exports = {
	streamVideo:  mediaService.playVideo,

};

