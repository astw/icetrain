
var formattedTime = function (value) {
  if(value < 0) value = 0;
  var minutes = parseInt(value /60);
  var seconds = value % 60;
  return {"minutes" :minutes ,  "seconds": seconds };
};

module.exports ={

  formattedTime : formattedTime

}
