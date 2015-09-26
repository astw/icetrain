'use strict';


angular.module('iceApp')
  .controller('FabricCtrl', function ($scope, $document, $http,$location,$routeParams, watchHistoryService) {


    /////
    ///// http://jsfiddle.net/3jk3jvy7/



    var canvas = new fabric.Canvas('c');
    //var canvas = $document.find("#c");
    canvas.backgroundColor = 'rgba(0,255,0,0.3)';
    var current = 'color'

    $scope.addText = function(){
      //var text = new fabric.Text('Hello world', {
      //  left: 100,
      //  top: 100,
      //  fill: '#f55'
      //});
      //canvas.add(text);
      ////
      var txtBox = new fabric.IText ("IText", {
        fontSize: 18,
        //fontFamily: 'Arial',
        textAlign: 'center',
        width: 120,
        height: 60
      });
      canvas.add(txtBox);

      txtBox = new fabric.Textbox ("Textbox", {
        fontSize: 18,
        //fontFamily: 'Arial',
        textAlign: 'center',
        width: 120,
        height: 60
      });
      canvas.add(txtBox);


      var txtBox3 = new fabric.IText("IText", {
        fontSize: 16,
        fontFamily: 'Arial',
        textAlign: 'center',
        fill: "rgba(255,0,0,0.9)",
        width: 120,
        height: 60
        ,
        boxPath: '/assets/test/callout/callout_circle_right/callout_circle_right.svg'
      });
      canvas.add(txtBox3);

     var  imageIText = new ImageIText ('hi ImageIText,',{
        fontSize: 16,
        fontFamily: 'Arial',
        textAlign: 'center',
        width: 120,
        height: 20,
        src:'/assets/test/callout/callout_rounded_rectangle_right/callout_rounded_rectangle_right.svg'
     });
     canvas.add(imageIText);

      imageIText = new ImageTextbox ('hi ImageITextBox,',{
          fontSize: 16,
          fontFamily: 'Arial',
          textAlign: 'center',
          width: 120,
          height: 60,
          src:'/assets/test/callout/callout_rectangle_right/callout_rectangle_right.svg'
        });
     canvas.add(imageIText);
    //
    //  var txtBox = new fabric.Textbox("A Great text to be rendered in the screen, wraped", {
    //    fontSize: 18,
    //    fontFamily: 'Arial',
    //    textAlign: 'center',
    //    width: 120,
    //    height: 60,
    //    boxPath; 'path/to/your/image.svg'
    //});

      imageIText = new fabric.BolloonTextbox ('hi BolloonTextbox ,',{
        fontSize: 18,
        fontFamily: 'Arial',
        textAlign: 'center',
        width: 120,
        height: 60,
        boxPath:'/assets/test/callout/callout_rectangle_right/callout_rectangle_right.svg'
      });
      canvas.add(imageIText);

     //
     // var  labeledRect = new ImageIText ('hi this 日我机构盘中带 ,',{
     //   fontSize: 6,
     //   fontFamily: 'Arial',
     //   textAlign: 'center',
     //   width: 120,
     //   height: 60,
     //   label:'test box',
     //   src:'/assets/test/callout/callout_circle_right/callout_circle_right.svg'
     // });
     // canvas.add(labeledRect);


  };

     $scope.changeBackground = function(){
      if(current === 'color'){
        // chnage to image
         canvas.setBackgroundImage('/assets/test/img_1852.jpg', canvas.renderAll.bind(canvas));
          fabric.Image.fromURL('/assets/test/callout/callout_circle_right/callout_circle_right.svg',
            function(oImage){
              canvas.add(oImage);
            });

          current = 'image';
      }
      else{
        current = 'color';
        canvas.setBackgroundImage('', canvas.renderAll.bind(canvas));
        canvas.backgroundColor = 'rgba(0,155,255,0.3)';
      }
    }

  });

