/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

   attributes: {

        name:{
            type:"string", 
            required:true,
            minLength:10,
            maxLength:100
        },
        
        desc:{
        	type:"string"
        }, 

        tutorid:{
            type: "integer",
            required:true,
            defaultsTo:-1
        } ,

        duration:{
        	type:"integer",
        	defaultsTo:-1
        }, 

        tags:{
        	type:"string"
        },

        status:{
        	type:"string",
        	enum:["processing","opened","closed"],
            defaultsTo:"processing"
        },

       rate :{
           type:"integer",
           defaultsTo:0
       },
        rank :{
            type:"integer",
            defaultsTo:0
        },

        viewtimes:{
        	type:"integer",
        	defaultsTo:-1
        },

        relased :{
        	type:"datetime"
        }
    },

    seedData:[
        {
           "name": "c# WCP starter",
            "desc": "to learn the baisc of wcf programming",
            "tutorid": '1' ,
            "duration":120,
            "tags":"c#,wpf",
            "status": "processing",
            "rate" : 5,
            "rank" : 3,
            "viewtimes": 1,
            "id":1
        },
        {
            "name": "java    starter",
            "desc": "to learn the baisc of java programming",
            "tutorid": 2 ,
            "duration":120,
            "tags":"java",
            "status": "processing",
            "rate" : 5,
            "rank" : 3,
            "viewtimes": 1,
            "id":2
        }
    ]
};

