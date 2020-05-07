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
	completed : {
		type : Boolean,
		default : false
	},
	deleted : {
		type : Boolean,
		default : false
	},
	user : {
		required : true,
		type: Schema.Types.ObjectId,
		ref: 'UserData'
	}
}, {
    versionKey: false // Version key not required to removing that
});

module.exports = mongoose.model('TodoData',todoschema);

