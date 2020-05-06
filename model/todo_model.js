const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoschema = new Schema({
	_id : Schema.Types.ObjectId,
	title : {
		type : String
	},
	description : {
		type : String
	},
	status : {
		type : Boolean,
		default : false
	},
	user : {
		required : true,
		type: Schema.Types.ObjectId,
		ref: 'UserData'
	}
});

module.exports = mongoose.model('TodoData',todoschema);

