const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/test1',
	{
	useNewUrlParser :true,
	useUnifiedTopology:true,
	useFindAndModify : false,
	useCreateIndex : true
	},(err)=>{
	  if(!err)
	  {
	  	  console.log("  ###  LocalHost MongoDB Connected !!!");
	  }
	  else
	  {
		  console.log(" # Error connection DB - "+err);
	  }
});