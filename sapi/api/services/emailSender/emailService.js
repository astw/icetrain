var mailer = require('sails-service-mailer');
var mailerConfig = require('../../../config/services/mailer');
var config = require('../config.js'); 
var emailTokenManager = require("../../services/emailTokenManager.js");
 
var Q = require('q');
var _  = require( 'lodash');
var moment = require('moment');
var fs = require('fs');
var nodemailer = require('nodemailer') ;
var smtpTransport = require('nodemailer-smtp-transport');

var EmailService = function(){
};

module.exports = new EmailService;


///------------------- implementation -----------------------------------------

EmailService.prototype.sendRegisterWelcomeEmail  = sendRegisterWelcomeEmail;
 
_.templateSettings.variable = "rc"; 

function sendRegisterWelcomeEmail(user) {   
      var emailInfo = getWelComeEmailData(user);  
      // send email
       return sendEmail(emailInfo); 
 } 
 
function sendEmail(emailInfo) {

  var emailType = emailInfo.emailType;
  var toEmail = emailInfo.recipients.join(',');
  var priorityLevel = emailInfo.priority || 'normal'; 

  var subject = emailInfo.subject; 
  var transporter = nodemailer.createTransport(smtpTransport(mailerConfig));
  
  var emailTemplateModel = emailInfo.data; 
  var templatePath = getEmailTemplate(emailType);
  var emailContent = getHtml(emailTemplateModel, templatePath);

  var mailOptions = {
    from:"故事大王 <wshuhao@gmail.com>",
    to: toEmail,
    subject: subject,
    html: emailContent,
    priority: priorityLevel
  };

  var deferred = Q.defer();

  sails.log('In MailerService.sendEmail.  Starting sending email....');
  
  transporter.sendMail(mailOptions, function(err,info){
    if(err){
      sails.log.error('Sending email failed. Error message:',err,  ',email configuration:', emailConfig );
      return deferred.reject(err);
    }
    sails.log.info('Email sent successfully.', info);
    return deferred.resolve(info);
  });

  return deferred.promise;
}

function getWelComeEmailData(user) { 
  var token = emailTokenManager.createRegistrationWelcomeToken(user);
  user.email = "wshuhao@gmail.com"; 
 
  var recipient = [];
  recipient.push(user.email);
  
  var storyToasterUrl = config.STORYTOASTER_URL;
  var link = storyToasterUrl + "/registration/confirm?token=" + token;
  return {
    emailType: 'registerWelcome',
    subject:"故事大王注册确认邮件",
    recipients: recipient,
    data: {
      userName:user.userName,
      link:link
    }
  }
}
  
function getEmailTemplate(emailType){
  if(emailType == 'registerWelcome'){
    return  "./api/template/email/register-welcome.html";
  }
  else if(emailType == 'forgetPassword'){
    return  "./api/template/email/forget-passwrod.html";
  }
  else if(emailType == 'buyBookOrder'){
    return  "./api/template/email/buy-book-order.html";
  }
}

function getHtml(model, templatePath, encoding){
  var html = fs.readFileSync(templatePath, encoding = "utf8");
  var template = _.template(html);
  return template(model);
} 