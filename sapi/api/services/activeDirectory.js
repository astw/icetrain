//
//
//var ActiveDirectory = require('activedirectory');
//
//module.exports ={
//
// auth:function(name,password){
//
////LDAP://abc.com/DC=abc,DC=com
//var config = {
//          url: 'ldap://icetrain.com',
//			   // url:'ldap://icetrain.com/DC=icetrian,DC=com',
//               baseDN: 'dc=icetain,dc=com'
//           //    ,username: 'administrator@icetrain.com'
//           //    ,password: ''
//           }
//
//    // config.url="url:ldap://absolute.com/DC=absolute,DC=com";
//    // config.baseDN ='dc=absolute,dc=com';
//
//var ad = new ActiveDirectory(config);
//
//console.log(ad);
//ad.authenticate(name, password, function(err, auth) {
//  if (err) {
//    console.log('ERROR: '+JSON.stringify(err));
//    return;
//  }
//
//  if (auth) {
//    console.log('Authenticated!');
//  }
//  else {
//    console.log('Authentication failed!');
//  }
//});
//
//
// }
//
//}
