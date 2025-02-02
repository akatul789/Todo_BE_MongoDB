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

 // ## localhost-----
// require("./model/localDB")

// ## Mongodb atlas--------
require("./model/cloudDB");


// importing models
var Todo = require('./model/todo_model');
var User = require('./model/user_model');

//--------------------Create user API ------------------------

app.post("/create/user",async(req,res)=>{
	try{
		console.log("\n\t--## Create user API called");

		var userobj = {
			"_id" : new mongoose.Types.ObjectId(),
			"name" : req.body.name,
			"email" : req.body.email,
			"profile_pic" : req.body.pp
		}


		var newUser = new User(userobj);

		// console.log(userobj);

		await newUser.save((err, user) => {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				console.log("  ## User Added !");
				res.status(200).json({
					success : true,
					message : "user added to DB",
					user_details : user
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
		console.log("\n\t--## View user API called");

		await User.find({}).exec((err,users)=> {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
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

//-------------------Delete user -------------------------------

app.post('/delete/user', (req,res) => {

	console.log("\n\t--## Delete user API called");

	User.findByIdAndDelete(req.body.id).exec((err,user)=> {
		if(err)
		{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
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

//----------------create todo -------------------

app.post("/create/todo",async(req,res)=>{
	console.log("\n\t--## Create todo API called");
	try{
		var todoobj = {
			"_id" : new mongoose.Types.ObjectId(),
			"title" : req.body.title,
			"description" : req.body.des,
			"user" : req.body.uid
		}
		var newTodo = new Todo(todoobj);

		// console.log(todoobj);

		await newTodo.save((err, todo) => {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
					success : true,
					message : "todo added",
					todo_details :todo
				});
			}
		})
	}
	catch(error){
		res.status(500)
	}
})

//----------------- view all todos ------------------------------
app.get("/todos",async(req,res)=>{
	console.log("\n\t--## View todo API called");

	try{
		await Todo.find({}).populate("user").exec((err,todos)=> {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
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
// app.post("/user/todo",async(req,res)=>{
// 	console.log("\n\t--## View todo API called");
// 	try{
// 		await Todo.find({user : req.body.uid}).populate("user").exec((err,todos)=> {
// 			if(err)
// 			{
// 				res.status(400).send("error  "+err);
// 			}
// 			else
// 			{
// 				res.status(200).json(todos);
// 			}
// 		});
// 	}
// 	catch(error){
// 		res.status(500)
// 	}
// })


// Dashboard API -- normal - completed - deleted / ---------------------------------------
app.post("/dashboard",async(req,res)=>{
	console.log("\n\t--## Dashboard API called");

	var check = req.body.type;
	if(!check)
	{
		res.status(400).send(" Type of dashboard not passed !! ");
		console.log("\t !! Type of dashboard not passed !!");
		return;
	}
	
	check=check.toLowerCase().trim();
	if(check == "normal")// || check == "Normal" || check =="NORMAL")
	{
		console.log("\t =-= Normal Dashboard");
		del = false;
		comp = false;
	}
	else if(check == "deleted")
	{
		console.log("\t =-= Deleted Dashboard");
		del = true;
		comp = false;
	}
	else if(check == "completed")
	{
		console.log("\t =-= completed Dashboard");
		del = false;
		comp = true;
	}
	else
	{
		res.status(400).send(" Wrong Type value of dashboard passed !! try again ");
		console.log("\t !!  Wrong Type value of dashboard passed !! try again");
		return;
	}
	try{
		await Todo.find({user : req.body.uid , deleted : del, completed : comp}).populate("user").exec((err,todos)=> {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
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



//--------------------Update todo ------------------------------

app.post('/update/todo', async(req,res) => {
	console.log("\n\t--## Update todo API called");

	var todoobj = {
		"title" : req.body.title,
		"description" : req.body.des,
	}

	await Todo.findByIdAndUpdate(req.body.tid,todoobj,{new :true}).exec((err,todo)=> {
		if(err || !todo)
		{
			res.status(400).send("Error encoutered  "+err);
			console.log("\t Error encoutered - "+err);
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
//----------------------delete todo--------------------------

app.post('/delete/todo',async (req,res) => {
	console.log("\n\t--## Delete todo API called");
	var restore=req.body.restore;
	var tempdel=req.body.tempdelete;
	var perdel=req.body.perdelete;

	var tid=req.body.tid;
	if(!tid)
	{
		res.status(400).send(" tid value not passed !! ");
		console.log("\t !! tid value not passed !!");
		return;
	}

	if(restore && restore.toLowerCase().trim() == "yes")
	{

		await Todo.findByIdAndUpdate(tid,{deleted : false},{new :true}).exec((err,todo)=> {
			if(err || !todo)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
						success : true,
						message : "todo restored",
						todo_updated : todo
					});
				console.log("\t Todo restored");
			}

		})
	}
	else if(tempdel && tempdel.toLowerCase().trim() == "yes")
	{

		await Todo.findByIdAndUpdate(tid,{deleted : true},{new :true}).exec((err,todo)=> {
			if(err || !todo)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
						success : true,
						message : "todo deleted temporary",
						todo_updated : todo
					});
				console.log("\t Todo deleted temporary");
			}

		})
	}
	else if(perdel && perdel.toLowerCase().trim() == "yes")
	{
		await Todo.findByIdAndDelete(tid).exec((err,todo)=> {
			if(err)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
						success : true,
						message : "todo deleted from DB",
						deleted_todo : todo
					});
				console.log("\t Todo deleted !");
			}

		})
	}
	else
	{
		res.status(400).send("No value passed ");
		console.log("\t No value passed ");
	}
})

//----------------------completed todo--------------------------

app.post('/comp/todo',async (req,res) => {
	console.log("\n\t--## complete todo API called");
	var restore=req.body.restore;
	var completed=req.body.completed;

	var tid=req.body.tid;
	if(!tid)
	{
		res.status(400).send(" tid value not passed !! ");
		console.log("\t !! tid value not passed !!");
		return;
	}

	if(restore && restore.toLowerCase().trim() == "yes")
	{

		await Todo.findByIdAndUpdate(tid,{completed : false},{new :true}).exec((err,todo)=> {
			if(err || !todo)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
						success : true,
						message : "todo restored",
						todo_updated : todo
					});
				console.log("\t Todo restored");
			}

		})
	}
	else if(completed && completed.toLowerCase().trim() == "yes")
	{

		await Todo.findByIdAndUpdate(tid,{completed : true},{new :true}).exec((err,todo)=> {
			if(err || !todo)
			{
				res.status(400).send("Error encoutered  "+err);
				console.log("\t Error encoutered - "+err);
			}
			else
			{
				res.status(200).json({
						success : true,
						message : "todo completed",
						todo_updated : todo
					});
				console.log("\t Todo completed");
			}

		})
	}
	else
	{
		res.status(400).send("No value passed ");
		console.log("\t No value passed ");
	}
})


//---------------profile details api ------------------

app.post("/profile_det",async(req,res)=>{
	console.log("\n\t--## Profile details API called");
	try{
		await User.findOne({_id : req.body.uid}).exec((err,user)=> {
			if(err)
			{
				res.status(400).send("Error encoutered can't find user "+err);
				console.log("\t Error encoutered - "+err);
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