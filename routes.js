var express=require('express');
var app=module.exports=express.Router();
var MobileUser=require('./models/mobile_user');
var BloodDonor=require('./models/blood_donor');
var Blood=require('./models/blood_packet');
var District=require('./models/district');
var Request=require('./models/emergency_request');

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
			// console.log(list)
			res.json({districts:list});
		}
	})

});

app.post('/add-request',function(req,res){
	var request=req.body.request;
	var emg_request=new Request();
	if(request.blood.length==3){
		emg_request.abo=request.blood[0]+request.blood[1];
		emg_request.rh=request.blood[2];
	}
	else{
		emg_request.abo=request.blood[0];
		emg_request.rh=request.blood[1];
	}
	emg_request.date=new Date();
	emg_request.description=request.description;
	emg_request.contact_person=request.name;
	emg_request.contact_no=request.tele_no;
	emg_request.district=request.district;
	emg_request.save(function(err){
		if(err){
			console.log(err)
			res.json({success:false,message:"Failed to finished the operation"})

		}
		else{
			BloodDonor.find({abo:emg_request.abo,rh:emg_request.rh}).select().exec(function(error,donorList){
				if(error){
					console.log(error)
					res.json({success:false,message:"Failed to finished the operation"})

				}
				else if(donorList.length>0){
					var donors=[];
					var validDuration=function(lastDate){
						var newDate=new Date();
						if(lastDate==null){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()>0){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()==0 && newDate.getMonth()-lastDate.getMonth()>4){
							return true;
						}
						else if(newDate.getYear()-lastDate.getYear()==0 && newDate.getMonth()-lastDate.getMonth()==4 && newDate.getDate()-lastDate.getDate()>0){
							return true;
						}
						else{
							
							return false;
						}
					}
					for(var i=0;i<donorList.length;i++){
						if(validDuration(donorList[i].last_donated_date)){
							donors.push(donorList[i]);

						}
					}
					if(donors.length>0){
						res.json({success:true,message:"Emergency request message posted",donors:donors})

					}
					else{
						res.json({success:true,message:"Emergency request message posted"})
					}
					
				}
				else{
					res.json({success:true,message:"Emergency request message posted"})

				}
			});

		}
	})

});

app.get('/get-request',function(req,res){
	Request.find({},function(err,requests){
		if(err){
			console.log(err);
		}
		else{
			res.json({requests:requests});
		}
	});

	// User.find({}, function(err, users) {
 //    var userMap = {};

 //    users.forEach(function(user) {
 //      userMap[user._id] = user;
 //    });

//    res.send(userMap);  
  // });

});

app.get('/get-donation-campaigns',function(req,res){
	Request.find({},function(err,campaigns){
		if(err){
			console.log(err);
		}
		else{
			res.json({campaigns:campaigns});
		}
	});



});



