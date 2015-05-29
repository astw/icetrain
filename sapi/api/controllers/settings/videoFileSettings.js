/**
 * Created by Administrator on 26/05/2015.
 */

module.exports.options = {
  tmpDir:  __dirname + '/../../../assets/uploaded/files/',
  publicDir: __dirname + '/../../../assets/uploaded/files/',
  uploadDir: __dirname + '/../../../assets/uploaded/files/',

  uploadUrl:  '/uploaded/files/',
  maxPostSize: 30000000, // 30M
  minFileSize:  1000,
  maxFileSize:  30000000, // 20M
  acceptFileTypes:/\.(gif|jpe?g|png|mp4|doc|docx|pdf|ppt)$/i,      /// /.+/i,
  // Files not matched by this regular expression force a download dialog,
  // to prevent executing any scripts in the context of the service domain:
  inlineFileTypes:  /\.(gif|jpe?g|png|doc|docx|pdf|ppt)$/i,
  imageTypes:  /\.(gif|jpe?g|png|doc|docx|pdf|ppt)$/i,
  imageVersions: {
    width:  80,
    height: 80
  },
  accessControl: {
    allowOrigin: '*',
    allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
    allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
  },
  nodeStatic: {
    cache:  3600 // seconds to cache served files
  }
};
