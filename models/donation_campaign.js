
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DonationCampaignSchema=new Schema({
  address:{type:String, required:true},
  charity_organization:{type:String,required:true},
  date:{type:String,required:true,default:null},
  district:{type:String,required:true,default:null},
  description:{type:String,required:true,default:null},
  from:{type:String,required:true},
  to:{type:String,required:true,default:null},
  latitude:{type:String,default:null},
  longitude:{type:String,default:null}

});

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyBtkTpWo3VXTQLvGzz-_uRBx1vRx-RfYnI', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);



DonationCampaignSchema.pre('save', function(next) {

	var campaign=this;
	if(campaign.longitude==null && campaign.latitude==null){
		
		geocoder.geocode(campaign.address, function(e, responce) {
			if(e){
				console.log(e)

			}
			else{
				console.log("here");
				console.log(responce[0]);
				console.log(responce[0].longitude+"  "+responce[0].latitude);
				this.latitude=responce.latitude;
		  		this.longitude=responce.longitude;		
			}
		  
		});	
		next();
	}
	else{
		next();
	}
  
});

module.exports=mongoose.model('DonationCampaign',DonationCampaignSchema);