

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
	
		
		exports.addnewproductview=function(req,res){
			res.render('addproduct',{username:req.session.username});
		};
		
		
		exports.updateproductview=function(req,res){
			
			var AWS = require('aws-sdk');
			AWS.config.update({region: 'us-east-1'});
			AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
			var db = new AWS.DynamoDB();
			
			
			var params = {
				    
				  TableName : 'product',
				  }

				db.scan(params, function(err, data) {
				 if (err) {
				   console.log(err); // an error occurred
				   } 
				 else
					 {
					 var temp=data["Items"];
					
					 var tempArray=new Array();
					 	for(var i=0;i< temp.length;i++)
					 		{
					 			tempArray.push(temp[i]);
					 		}
					 
					 	res.render('updateproduct',{tittle:'My Store : Add product',productArray:tempArray,username:req.session.username});
					 
					 }
				});
			
			
			
			
			//res.render('updateproduct',{username:req.session.username});
		};
		
		exports.deleteproductview=function(req,res){
			var AWS = require('aws-sdk');
			AWS.config.update({region: 'us-east-1'});
			AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
			var db = new AWS.DynamoDB();
			
			
			var params = {
				    
				  TableName : 'product',
				  }

				db.scan(params, function(err, data) {
				 if (err) {
				   console.log(err); // an error occurred
				   } 
				 else
					 {
					 var temp=data["Items"];
					
					 var tempArray=new Array();
					 	for(var i=0;i< temp.length;i++)
					 		{
					 			tempArray.push(temp[i]);
					 		}
					 
					 	res.render('deleteproduct',{tittle:'My Store : Add product',productArray:tempArray,username:req.session.username});
					 
					 }
				});
			
			
			//res.render('deleteproduct',{username:req.session.username});
		};
		
		
		
	exports.addnewproduct=function(req,res){

		var AWS = require('aws-sdk');
		AWS.config.update({region: 'us-east-1'});
		AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
		var db = new AWS.DynamoDB();
		var random=Math.floor((Math.random() * 1000) + 1);
		var input = JSON.parse(JSON.stringify(req.body));
		var params = {
				  TableName : 'product',
				  "Key":{
					  "id":{
						  "S":random.toString()
					  }
				  },
				  "AttributeUpdates":{
					  
					 "category":{
							"Value":{
								"S":input.category.toString()  
							},
							"Action":"PUT"
						 },
						 "cost":{
								"Value":{
									"N":input.cost.toString()  
								},
								"Action":"PUT"
							 },
							 "name":{
									"Value":{
										"S":input.name.toString()  
									},
									"Action":"PUT"
								 },
								 "quantity":{
										"Value":{
											"N":input.quantity.toString()  
										},
										"Action":"PUT"
									 },
						 "description":{
								"Value":{
									"S":input.description.toString()  
								},
								"Action":"PUT"
							 }
				  }
				  
			}
		
		db.updateItem(params, function(err, data) {
			if (err) {
				console.log(err); // an error occurred
				callback(err);
			}
			else {
				//console.log(data); // successful response
				console.log(data);
			}
		});
		res.redirect("/");
		
	};
		
	exports.updateproduct=function(req,res){

		var AWS = require('aws-sdk');
		AWS.config.update({region: 'us-east-1'});
		AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
		var db = new AWS.DynamoDB();
		//var random=Math.floor((Math.random() * 1000) + 1);
		console.log("inside update function eshan");
		var input = JSON.parse(JSON.stringify(req.body));
		var params = {
				  TableName : 'product',
				  "Key":{
					  "id":{
						  "S":req.params.id.toString()
					  }
				  },
				  "AttributeUpdates":{
					  
					 "category":{
							"Value":{
								"S":input.category.toString()  
							},
							"Action":"PUT"
						 },
						 "cost":{
								"Value":{
									"N":input.cost.toString()  
								},
								"Action":"PUT"
							 },
							 "name":{
									"Value":{
										"S":input.name.toString()  
									},
									"Action":"PUT"
								 },
								 "quantity":{
										"Value":{
											"N":input.quantity.toString()  
										},
										"Action":"PUT"
									 },
						 "description":{
								"Value":{
									"S":input.description.toString()  
								},
								"Action":"PUT"
							 }
				  }
				  
			}
		
		db.updateItem(params, function(err, data) {
			if (err) {
				console.log(err); // an error occurred
				callback(err);
			}
			else {
				//console.log(data); // successful response
				console.log(data);
			}
		});
		res.redirect("/");
		
	};
	
	exports.deleteproduct=function(req,res){

		var AWS = require('aws-sdk');
		AWS.config.update({region: 'us-east-1'});
		AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
		var db = new AWS.DynamoDB();
		//var random=Math.floor((Math.random() * 1000) + 1);
		var input = JSON.parse(JSON.stringify(req.body));
		var params = {
				  TableName : 'product',
				  "Key":{
					  "id":{
						  "S":req.params.id.toString()
					  }
				  },
				  
				  
			}
		
		db.deleteItem(params, function(err, data) {
			if (err) {
				console.log(err); // an error occurred
				callback(err);
			}
			else {
				//console.log(data); // successful response
				console.log(data);
			}
		});
		res.redirect("/");
		
	};
	
exports.all=function(req,res){
	
	
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	
	
	var params = {
		    
		  TableName : 'product',
		  }

		db.scan(params, function(err, data) {
		 if (err) {
		   console.log(err); // an error occurred
		   } 
		 else
			 {
			 var temp=data["Items"];
			
			 var tempArray=new Array();
			 	for(var i=0;i< temp.length;i++)
			 		{
			 			tempArray.push(temp[i]);
			 		}
			 
			 	res.render('allproduct',{tittle:'My Store : All Products',productArray:tempArray,username:req.session.username});
			 
			 }
		});
	
	
};		

exports.alltv=function(req,res){
	if(req.session.username!=null )
		{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});

		
		
	var mongoclient=require("mongodb").MongoClient;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							collection.find({category:"tv"}).toArray(function(error,items)
									{
										if(items.length!=0)
											{
												res.render('alltvproduct',{tittle:'My Store : TV',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{res.redirect("/store/login")}
};

exports.allrouter=function(req,res){
	if(req.session.username!=null)
	{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});
		
	var mongoclient=require("mongodb").MongoClient;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							collection.find({category:"router"}).toArray(function(error,items)
									{
										if(items.length!=0)
											{
												res.render('allrouterproduct',{tittle:'My Store : Router',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{
			res.redirect("/store/login");
		}
};

exports.allcar=function(req,res){
	if(req.session.username!=null)
	{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});
		
	var mongoclient=require("mongodb").MongoClient;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							collection.find({category:"car"}).toArray(function(error,items)
									{
										if(items.length!=0)
											{
												res.render('allcarproduct',{tittle:'My Store : Car',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{
			res.redirect("/store/login");
		}
};

exports.tvsingle=function(req,res){
	if(req.session.username!=null)
	{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});
		
	var mongoclient=require("mongodb").MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							collection.find({brand:req.params.brand}).toArray(function(error,items)
									{
										if(items.length!=0)
											{console.log("data"+items);
												res.render('tvproduct',{tittle:'My Store : TV',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{
			redirect("/store/login");
		}
};


exports.routersingle=function(req,res){
	if(req.session.username!=null)
	{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});
		
	var mongoclient=require("mongodb").MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							collection.find({brand:req.params.brand.toString()}).toArray(function(error,items)
									{
										if(items.length!=0)
											{
												res.render('routerproduct',{tittle:'My Store : Router',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{
			res.redirect("/store/login");
		}
};


exports.carsingle=function(req,res){
	if(req.session.username!=null)
	{
		
		var mongoclient=require("mongodb").MongoClient;
		var count="0";
		
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
				{
					if(err){return console.dir(err);}
					
					console.log("we are connected to Mongo DB");
					
					db.collection("cart",function(error,collection)
							{
								collection.aggregate([{$group:{_id:{username:req.session.username},totalQty:{$sum:"$quantity"}}}],function(er,ee){
									if(ee.length!=0){
										count=ee[0].totalQty;
									}
								});
									
							});
				
				});
		
	var mongoclient=require("mongodb").MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				
				console.log("we are connected to Mongo DB");
				
				db.collection("product",function(error,collection)
						{
							console.log("we have the collection");
							console.log(req.params.id);
							collection.find({model:req.params.model}).toArray(function(error,items)
									{
										if(items.length!=0)
											{
												
												res.render('carproduct',{tittle:'My Store : car',productArray:items,username:req.session.username,countProduct:count});
											}
									});
						});
			});
	}
	else
		{
			res.redirect("/store/login");
		}
};