
// URL ---
// mongodb+srv://akatul789:<password>@cluster0-gndbx.mongodb.net/Todo_mongo_test

// pass - aks1019

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://cluster0-gndbx.mongodb.net/',
{
	dbName : 'Todo_mongo_test',
	user : 'akatul789',
	pass : 'aks1019',
	useNewUrlParser :true,
	useUnifiedTopology:true,
	useFindAndModify : false,
	useCreateIndex : true
},(error)=>{
	if(!error)
	{
		console.log("  ###  Cloud MongoDB Atlas Connected !!!");
	}
	else
	{
		console.log(" # Error connection DB - "+error);
	}
});