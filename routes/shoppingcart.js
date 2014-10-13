

exports.displayerror = function(req, res){
	/*
	var mongoclient=require("mongodb").MongoClient;
	 mongoclient.connect("mongodb://localhost:27017/admin", function(err, db) {
		 if(err) { return console.dir(err); }	
	
		 console.log("we are connected");
		 
		 db.collection("cart", function(error,collection){
			 console.log("We have the collection");
			 collection.find({username:req.session.username}).toArray(function(error, items) {
			 if(items.length!=0)
				 {
				 res.render('shopppingcart', { tittle:'My Store : Products',productArray:items,username:req.session.username });
				 }
			 });
			 });
		 });
	 */
	
	//Dynamo part
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	var params = {
		    
			  TableName : 'cart',
			  "ScanFilter": {
			        "username": {
			        	"AttributeValueList":[
			        	       {
			        	    	   "S":req.session.username
			        	       }
			        	  ],
			        	  "ComparisonOperator": "EQ"
			          }
			           
				}
			  }

			db.scan(params, function(err, data) {
			 if (err) {
			   console.log(err); // an error occurred
			   } 
			 else
				 {
				 //console.log(data);
				 var temp=data["Items"];
				 //console.log(data["Items"].length);
				 //console.log(data["Items"]);
				 var totalcost=0;
				 var tempArray=new Array();
				 	for(var i=0;i< temp.length;i++)
				 		{
				 			tempArray.push(temp[i]);
				 			console.log("unit cost :" +(temp[i]["unitcost"]["N"]));
				 			totalcost=totalcost+(parseInt((temp[i]["unitcost"]["N"]))*parseInt((temp[i]["quantity"]["N"])));
				 		}
				 	console.log(totalcost);
				 	res.render('shoppingcart',{tittle:'My Store : Shopping Cart',productArray:tempArray,username:req.session.username,cost:totalcost,error:req.params.quantity});
				
				 }
			});
	
		};
	


		exports.display = function(req, res){
			/*
			var mongoclient=require("mongodb").MongoClient;
			 mongoclient.connect("mongodb://localhost:27017/admin", function(err, db) {
				 if(err) { return console.dir(err); }	
			
				 console.log("we are connected");
				 
				 db.collection("cart", function(error,collection){
					 console.log("We have the collection");
					 collection.find({username:req.session.username}).toArray(function(error, items) {
					 if(items.length!=0)
						 {
						 res.render('shopppingcart', { tittle:'My Store : Products',productArray:items,username:req.session.username });
						 }
					 });
					 });
				 });
			 */
			
			//Dynamo part
			var AWS = require('aws-sdk');
			AWS.config.update({region: 'us-east-1'});
			AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
			var db = new AWS.DynamoDB();
			var params = {
				    
					  TableName : 'cart',
					  "ScanFilter": {
					        "username": {
					        	"AttributeValueList":[
					        	       {
					        	    	   "S":req.session.username
					        	       }
					        	  ],
					        	  "ComparisonOperator": "EQ"
					          }
					           
						}
					  }

					db.scan(params, function(err, data) {
					 if (err) {
					   console.log(err); // an error occurred
					   } 
					 else
						 {
						 //console.log(data);
						 var temp=data["Items"];
						 //console.log(data["Items"].length);
						 //console.log(data["Items"]);
						 var totalcost=0;
						 var tempArray=new Array();
						 	for(var i=0;i< temp.length;i++)
						 		{
						 			tempArray.push(temp[i]);
						 			console.log("unit cost :" +(temp[i]["unitcost"]["N"]));
						 			totalcost=totalcost+(parseInt((temp[i]["unitcost"]["N"]))*parseInt((temp[i]["quantity"]["N"])));
						 		}
						 	console.log(totalcost);
						 	res.render('shoppingcart',{tittle:'My Store : Shopping Cart',productArray:tempArray,username:req.session.username,cost:totalcost,error:null});
						
						 }
					});
			
				};
			

		exports.list = function(req, res){
			
			var mongoclient=require("mongodb").MongoClient;
			 mongoclient.connect("mongodb://localhost:27017/admin", function(err, db) {
				 if(err) { return console.dir(err); }	
			
				 console.log("we are connected");
				 
				 db.collection("product", function(error,collection){
					 console.log("We have the collection");
					 collection.find().toArray(function(error, items) {
					 if(items.length!=0)
						 {
						 res.render('product', { tittle:'My Store : Products',productArray:items,username:req.session.username });
						 }
					 });
					 });
				 });
				};
			