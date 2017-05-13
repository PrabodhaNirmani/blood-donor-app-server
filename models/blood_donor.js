
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
    message: "Name must have at least 3 charactors and at most 30 charactors. there must not be any special charactors and numbers in between them"
  })
];

var emailValidator = [
  
  validate({
    validator: 'isEmail',
    message: "Email is not a valid email"
  }),

  validate({
    validator: 'isLength',
    arguments: [3,35],
    message: "Email should in between ARGS[0] and ARGS[1] charactors "
  })
];

var BloodDonorSchema=new Schema({

	name:{type:String, required:true, validate:nameValidator},
  nic_no:{type:String, required:true, unique:true},
  birthday:{type:Date,required:true},
  gender:{type:String, required:true},
  age:{type:Number, required:true},
  district:{type:String,required:true},
  address:{type:String, required:true},
  tele_no:{type:String, required:true},
  email:{type:String, lowercase:true, required:true, unique:true,validate:emailValidator},
  abo:{type:String, required:true},
  rh:{type:String,required:true},
  donation_count:{type:Number,default:0},
  last_donated_date:{type:Date,default:null}
});



BloodDonorSchema.plugin(titlize, {
  paths: ['name']
});


module.exports=mongoose.model('BloodDonor',BloodDonorSchema);