 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
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


var StaffMemberSchema=new Schema({
	
  name:{
    type:String,
    required:true, 
    validate: nameValidator
  },
	
  email:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    validate: emailValidator
  },

  tele_no:{
    type:String,
    required:true
  },
  active:{
    type:Boolean, default:false, required:true
  },
  temporyToken:{
    type:String, default:null
  }
});



StaffMemberSchema.plugin(titlize, {
  paths: ['name']
});


module.exports=mongoose.model('StaffMember',StaffMemberSchema);

