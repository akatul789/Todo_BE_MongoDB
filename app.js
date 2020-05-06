const express = require('express');
const path = require("path");
const expressHandlers = require("express-handlebars");
const bodyparser = require("body-parser");
const cors = require('cors');


// const morgan = require("morgan");

const mongoose = require('mongoose');

const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

// DB connect
require("./model/fetch")

//models
// require("./model/Post")

require("./model/user_model");



const UserD = mongoose.model("UserData");
// const Post = mongoose.model("Post");

app.get("/posts",async(req,res)=>{
	try{
		const posts = await Post.find({})
		res.send(posts)

	}
	catch(error){
		res.status(500)
	}
})


//-------------------------------------------------------

app.get("/users",async(req,res)=>{
	try{
		const users = await UserD.find({})
		res.send(users)

	}
	catch(error){
		res.status(500)
	}
})


// find all
app.get("/users/:uidd",async(req,res)=>{
	try{
		const users = await UserD.find({ uid : req.params.uidd})
		res.send(users);


	}
	catch(error){
		res.status(500)
	}
})



// find one
// app.get("/users/:uidd",async(req,res)=>{
// 	try{
// 		const users = await UserD.findOne({ uid : req.params.uidd})
// 		res.send(users);


// 	}
// 	catch(error){
// 		res.status(500)
// 	}
// })

// insert values 

app.post("/users",async(req,res)=>{
	try{
		const user = new UserD();
		user.uid = req.body.uid;
		user.name =req.body.name;
		user.email = req.body.email;
		user.profile_pic = req.body.pp;
		
		var todo=[];
		obj={
		tid : req.body.tid,
		title : req.body.title,
		description : req.body.des
	}
	
	todo.push(obj);
	console.log(todo);
	user.todos=todo;
		// user.todos.push(tid:'2',title:'als');
		// await user.save();
		res.send(user)

	}
	catch(error){
		res.status(500)
	}
})



// Test api ----
app.get("/",(req,res)=>{
	res.send('<h1>Test API<h1>')
})




// Port no. -----
const port = 3000;


// -------------------------------------
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});