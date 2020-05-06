var express = require('express');
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require('mongoose');

const cors = require('cors');



var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// app.use(bodyparser.urlencoded({ extended: true}));

app.use(cors());

// ###### DB connection ----------------

require("./model/localDB")


// importing models
var Todo = require('./model/todo_model');
var User = require('./model/user_model');

//--------------------Create user API ------------------------

app.post("/create/user",async(req,res)=>{
	try{
		console.log(" ## Create user API called");

		var userobj = {
			"_id" : new mongoose.Types.ObjectId(),
			"name" : req.body.name,
			"email" : req.body.email,
			"profile_pic" : req.body.pp
		}


		var newUser = new User(userobj);

		console.log(userobj);

		await newUser.save((err, user) => {
			if(err)
			{
				res.status(400).send("Error adding user");
			}
			else
			{
				console.log("  ## User Added !");
				res.status(200).json({
					success : true,
					message : "user added to DB",
					user_det : user
				});
			}
		})

	}
	catch(error){
		res.status(500)
	}
});

//-----------------------View users-----------------------------

app.get("/users",async(req,res)=>{
	try{
		await User.find({}).exec((err,users)=> {
			if(err)
			{
				res.status(400).send("err");
			}
			else
			{
				res.status(200).json(users);
			}
		});
	}
	catch(error){
		res.status(500)
	}
})

//-------------------delete user -------------------------------

app.post('/delete/user', (req,res) => {
	console.log("# delete user api");

	User.findByIdAndDelete(req.body.id).exec((err,user)=> {
		if(err)
		{
			res.status(400).send("err deleting user");
		}
		else
		{
			res.status(200).json({
					success : true,
					message : "user deleted from DB",
					user_deleted : user
				});
		}

	})


})

//----------------- view all todos ------------------------------
app.get("/todos",async(req,res)=>{
	try{
		await Todo.find({}).populate("user").exec((err,todos)=> {
			if(err)
			{
				res.status(400).send("err");
			}
			else
			{
				res.status(200).json(todos);
			}
		});
	}
	catch(error){
		res.status(500)
	}
})


// view specific user todo ---------------------------------------
app.post("/user/todo",async(req,res)=>{
	try{
		await Todo.find({user : req.body.uid}).populate("user").exec((err,todos)=> {
			if(err)
			{
				res.status(400).send("err");
			}
			else
			{
				res.status(200).json(todos);
			}
		});
	}
	catch(error){
		res.status(500)
	}
})




//----------------create todo -------------------

app.post("/create/todo",async(req,res)=>{
	try{

		console.log("## adding todo api");

		var todoobj = {
			"_id" : new mongoose.Types.ObjectId(),
			"title" : req.body.title,
			"description" : req.body.des,
			"user" : req.body.uid
		}
		var newTodo = new Todo(todoobj);

		console.log(todoobj);

		await newTodo.save((err, todo) => {
			if(err)
			{
				res.status(400).send("err adding todo");
			}
			else
			{
				res.status(200).json(todo);
			}
		})
	}
	catch(error){
		res.status(500)
	}
})


//----------------------delete todo--------------------------

app.post('/delete/todo',async (req,res) => {
	console.log("delete todo api");

	await Todo.findByIdAndDelete(req.body.tid).exec((err,todo)=> {
		if(err)
		{
			res.status(400).send("err deleting user");
		}
		else
		{
			res.status(200).json({
					success : true,
					message : "todo deleted from DB",
					deleted_todo : todo
				});
		}

	})

})


//--------------------Update todo ------------------------------

app.post('/update/todo', async(req,res) => {
	console.log("## update api called");


	var todoobj = {
		"title" : req.body.title,
		"description" : req.body.des,
	}

	await Todo.findByIdAndUpdate(req.body.tid,todoobj,{new :true}).exec((err,todo)=> {
		if(err)
		{
			res.status(400).send("err adding user");
		}
		else
		{
			res.status(200).json({
					success : true,
					message : "todo updated",
					todo_updated : todo
				});
		}

	})


})


//---------------profile details api ------------------

app.post("/profile_det",async(req,res)=>{
	try{
		await User.findOne({_id : req.body.uid}).exec((err,user)=> {
			if(err)
			{
				res.status(400).send("Error.. cannot find user");
			}
			else
			{
				res.status(200).json(user);
			}
		});
	}
	catch(error){
		res.status(500)
	}
})

// Test api ----
app.get("/",(req,res)=>{
	res.send('<h1>Test API Working ! <h1><br><h2>LOL<h2>')
})


// Port no. -----
const port = 3000;

// -------------------------------------
app.listen(port, () => {
    console.log("  # Express Server started on port "+ port);
});