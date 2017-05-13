
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BloodPacketSchema=new Schema({
  blood_packet_id:{type:String, required:true},
  abo:{type:String, required:true},
  rh:{type:String,required:true},
  expiration_date:{type:Date,required:true,default:null},
  donated_date:{type:Date,required:true,default:null},
  release_date:{type:Date,required:true,default:null},
  release_status:{type:Boolean,required:true},
  expire_status:{type:Boolean,required:true,default:null}

});

BloodPacketSchema.pre('find', function(next) {

	var blood=this;
	if(blood.expiration_date<new Date()){
		
		blood.expire_status=true;
		next();
	}
	else{
		next();
	}
  
});




module.exports=mongoose.model('BloodPacket',BloodPacketSchema);