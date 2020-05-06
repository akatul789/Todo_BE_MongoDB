const mongoose = require('mongoose');


var userschema = new mongoose.Schema({
	uid:{
		type : String
	},
	name : {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true
	},
	profile_pic : {
		type : String
	},
	todos : [
			{tid : 
				{type : String}
			},
			{title : {type : String}
			},
			{description : {	type : String}
			},
			{status : {type : Boolean}
			},
			{deleted : {type : Boolean}
			}
	] 
});

module.exports = mongoose.model('UserData',userschema);

