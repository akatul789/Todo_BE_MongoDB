const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userschema = new Schema({

	_id: {
		type: Schema.Types.ObjectId
	},
	name : {
		type : String,
		required : true,
		validate : {
			validator : function(text) {
				return text.length >0;
			},
			message : "empty name not allowed"
		}
	},
	email : {
		type : String,
		required : true
	},
	profile_pic : {
		type : String
	}

});

module.exports = mongoose.model('UserData',userschema);

