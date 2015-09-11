var ImageTextbox = fabric.util.createClass(fabric.Textbox, {

  type: 'imageTextbox',
  src:'',

  initialize: function(text,options) {
    options || (options = { });

    this.callSuper('initialize', text);
    this.fontSize = options.fontSize;

    this.image = new Image();
    this.image.src = options.src;

    this.image.onload = (function(){
      this.loaded = true;
      this.setCoords();
      this.fire('image:loaded');
    }).bind(this);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      label: this.get('label')
    });
  },

  _render: function(ctx) {
    if(this.loaded)
    {
      ctx.drawImage(this.image, -this.width / 2 -20, -this.height / 2 -20 , this.width + 100, this.height + 50 );
      //    //ctx.drawImage(this.image, -150, -50, this.width + 50, this.height + 50 );
    }

    console.log("x= " + this.width + " y=" + this.height);

    this.callSuper('_render', ctx);
  }
});

