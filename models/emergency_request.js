
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmergencyRequestSchema=new Schema({
  abo:{type:String, required:true},
  rh:{type:String,required:true},
  date:{type:Date,required:true,default:null},
  district:{type:String,required:true,default:null},
  description:{type:String,required:true,default:null},
  contact_no:{type:String,required:true},
  contact_person:{type:String,required:true,default:null}

});




module.exports=mongoose.model('EmergencyRequest',EmergencyRequestSchema);