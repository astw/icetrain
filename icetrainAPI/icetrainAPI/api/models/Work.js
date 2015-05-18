/**
 * Created by Administrator on 16/05/2015.
 */

module.exports = {

  attributes: {
    name:{
      type:'string'
    }

    ,
    workItems :{
      collection:"WorkItem",
      via:'work'
    }

    //,
    //modules :{
    //  collection:"Module",
    //  via:"work"
    //}
  }
};
