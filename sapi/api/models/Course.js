/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Q = require("q");
var tokenHelper = require("../services/tokenHelper.js");

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
        },

       level:{
           type:"string",
           enum:["beginner","medium","advanced"],
           defaultsTo:"medium"
       },

       coursetype:{
           type:"string"
       },
       sections:{
         collection :"CourseSection",
         via:"Course"
       },

     getSections: function () {
       var obj = this.toObject();
       var defer = Q.defer();
       CourseSection.find({courseid:obj.id})
         .then(function (sections) {
           defer.resolve(sections);
         });
       return defer.promise;
     },

     enId :function(){
       var obj = this.toObject();
       return tokenHelper.getEnId(obj.id);
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
            "coursetype":".net",
            "level":"medium",
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
            "coursetype":"java",
            "level":"medium",
            "id":2
        }
    ]
};

