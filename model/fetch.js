// var express = require('express');
// var mongodb = require('mongodb');
// var router =express.Router();
// 
// var tech = mongodb.MongoClient;

// router.get("/",(req,res)=>{
// 	tech.connect('mongodb://localhost:27017/crud',
// 		(err,db)=>{
// 			db.collection('users').find().ToArray((err,array)=>{
// 				res.send(array);
// 			})
// 		})
// });

// module.exports =router;




const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/crud',
	{
	useNewUrlParser :true,
	useUnifiedTopology:true
},(error,db)=>{
	if(!error)
	{
		console.log("  ###  MongoDB Connected !!!");
	}
	else
	{
		console.log(" # Error connection DB - "+error);
	}
});