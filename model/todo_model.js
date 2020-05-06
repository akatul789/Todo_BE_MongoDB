const mongoose = require('mongoose');


var todoschema = new mongoose.Schema({
	tid:{
		type : String
	},
	title : {
		type : String
	},
	description : {
		type : String
	},
	status : {
		type : String
	}
});

mongoose.model('Todo',todoschema);

