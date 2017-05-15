var logger=require('morgan');
var cors=require('cors');
var http=require('http');
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var config=require('./config.json');
var path=require('path');

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

if(process.env.NODE_ENV==='development'){
	app.use(logger('dev'));

}

var port=process.env.PORT||5000;
mongoose.Promise=global.Promise;
// mongodb://127.0.0.1:27017/online_blood_bank
mongoose.connect(config.database);
app.use(require('./routes'));

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
})


http.createServer(app).listen(port,function(err){
	console.log("connected to the port"+port);
});
