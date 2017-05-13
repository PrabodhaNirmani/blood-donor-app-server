var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistrictSchema=new Schema({

	district:{type:String, required:true},
	valid:{type:Boolean,required:true,default:true}

 
});


module.exports=mongoose.model('District',DistrictSchema);