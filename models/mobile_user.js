var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var validate = require('mongoose-validator');



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

var usernameValidator = [

  validate({
    validator: 'isLength',
    arguments: [5,25],
    message: "Username should in between ARGS[0] and ARGS[1] charactors "
  })
];




var MobileUserSchema=new Schema({
	name:{
    type:String,required:true, default: null
  },
  email:{
    type:String, lowercase:true, required:true, unique:true, validate:emailValidator
  },
	username:{
    type:String, lowercase:true, required:true, unique:true, validate:usernameValidator
  },
  password:{
    type:String, required:true
  },
  role:{
    type:String, required:true
  },
  
});

MobileUserSchema.pre('save', function(next) {
  var user=this;

  if(!user.isModified('password')) return next();
  bcrypt.hash(user.password,null,null,function(err,hash){
  	if(err) return next(err);
  	
  	user.password=hash;
  	next();
  })
  
});




MobileUserSchema.methods.comparePassword=function(password){
  return bcrypt.compareSync(password,this.password);

}



module.exports=mongoose.model('MobileUser',MobileUserSchema);