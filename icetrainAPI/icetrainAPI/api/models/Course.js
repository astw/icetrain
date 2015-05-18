/**
 * Created by Administrator on 16/05/2015.
 */

module.exports = {

  attributes: {
    name:{
      type:'string'
    }

    ,
    modules :{
      collection:"Module",
      via:'course'
    }

  }
};
