var express=require('express');
var app=module.exports=express.Router();
var MobileUser=require('./models/mobile_user');
var BloodDonor=require('./models/blood_donor');
var Blood=require('./models/blood_packet');
var District=require('./models/district');

app.get('/test',function(req,res){
	console.log("teag");
	return res.json({"success":true,"message":"done"});
});

app.post('/authenticate',function(req,res){
	var donor=req.body.user;
	MobileUser.findOne({username:donor.username}).select().exec(function(err,user){
		if(err){
			console.log("select err")
			res.json({success:false,message:err});
		}
		else if(!user){

			res.json({success:false, message:"Counld not authenticate user"});

		}
		else{
			var validPassword=user.comparePassword(donor.password);
			if(!validPassword){
				res.json({success:false,message:"Counld not authenticate password",forgetPassword:true});
			}
			else{
				res.json({success:true,message:"User authenticated successfully"});
			}
		}
	});

});

app.post('/sign-up-donor',function(req,res){
	var donor=req.body.user;
	
	BloodDonor.findOne({email:donor.email}).select('email name').exec(function(err,d){
		if(err){
			console.log("select err")
			res.json({success:false,message:err});

		}
		else if(!d){
			res.json({success:false,message:"Blood donor is not registered in blood bank"})	

		}
		else{
			MobileUser.findOne({email:donor.email}).select().exec(function(err,u){
				if(err){
					console.log("select err")
					res.json({success:false,message:err});

				}
				else if(u){
					res.json({success:false,message:"You have already sign in to the sysetem. please login",login:true})	

				}
				else{
					var user=new MobileUser();
					user.email=donor.email;
					user.username=donor.username;
					user.password=donor.password;
					user.name=d.name;
					user.role="donor";
					
					if(donor.password==donor.cpassword){
						user.save(function(err){
							if(err){
					
								res.json({success: false,message:err})
							}

							else{
								res.json({success: true,message:"You have successfully created your account"});
							}
							
						});	
					}
					else{
						res.json({success: false,message:"Password has not matched with  confirm password"})
					}
				}
			});
		}
	});
});

app.post('/search-blood',function(req,res){
	var blood=req.body.blood.blood;
	console.log(blood)
	if(blood.length==3){
		var abo=blood[0]+blood[1];
		var rh=blood[2];
	}
	else{
		var abo=blood[0];
		var rh=blood[1];
	}
	Blood.find({abo:abo,rh:rh,expired_status:false,released_status:false}).select().exec(function(err,bloodList){
		if(err){
			res.json({success: false,message:err});
		}
		else if(bloodList.length<=2){
			res.json({success: true,low:true});

		}
		else if(bloodList.length<=10){
			res.json({success: true,normal:true});
		}
		else{
			res.json({success: true,high:true});
		}

	});
		


});

app.get('/get-districts',function(req,res){
	District.find({valid:true}).select('district').exec(function(err,list){
		if(err){
			console.log("err");

		}
		else{
			res.json({districts:list});
		}
	})

});