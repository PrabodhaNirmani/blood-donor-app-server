var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DonationSchema=new Schema({
  blood_packet_id:{type:String, required:true},
  donor_id:{type:String,required:true}
});



module.exports=mongoose.model('Donation',DonationSchema);