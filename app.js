
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , users = require('./routes/users')
  , shoppingcart=require('./routes/shoppingcart')
  , product = require('./routes/product')
  , http = require('http')
  , path = require('path');

var app = express();

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
var DynamodbStore = require('connect-dynamodb')(express);
app.use(express.cookieParser());
app.use(express.session({ store: new DynamodbStore(AWS), secret: 'keyboard cat'}));

var mysql = require('mysql');
var connection  = require('express-myconnection'); 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/index', routes.index);
//app.get('/users', user.list);

app.get('/store',product.all);
/*
app.get('/store/tv/:brand',product.productsingle);
//app.get('/store/wirelessrouter/:brand',product.routersingle);
//app.get('/store/car/:model',product.carsingle);
//app.get('/store/tv',product.alltv);
//app.get('/store/car',product.allcar);
//app.get('/store/wirelessrouter',product.allrouter);
*/

app.get('/store/register',function(req,res)
		{
	//req.session.username=null;
	res.render('register');
});
app.post('/store/register',users.save);

app.get('/store/login',users.login);
app.get('/store/logout',function(req,res)
		{
			req.session.username=null;
			res.redirect('/store/login');
		});
app.post('/validate',users.validate);
app.get('/',product.all);
app.get('/store/shoppingcart',shoppingcart.display);
app.get('/store/shoppingcart/updateerror/:quantity',shoppingcart.displayerror);
app.post('/store/addnewproduct',product.addnewproduct);
app.get('/store/addnewproduct',product.addnewproductview);

app.post('/store/updateproduct/:id',product.updateproduct);
app.get('/store/updateproduct',product.updateproductview);

app.post('/store/deleteproduct/:id',product.deleteproduct);
app.get('/store/deleteproduct',product.deleteproductview);
app.get("/checkout",function(req,res)
		{
			res.render("checkout",{username:req.session.username});
		});

app.get('/orderhistory',function(req,res){
	 var input = JSON.parse(JSON.stringify(req.body));

	    var mysql=require('mysql');
	    var connection = mysql.createConnection({

	    	host: 'test.cb3axxkhhlwq.us-east-1.rds.amazonaws.com',

	    	user: 'root',

	    	password: 'password',

	    	port: '3306',

	    	database: 'test'

	    	});
	    
	    var user_name    = req.session.username;

        // var user_password = input.password;

  console.log("username="+user_name);
  
  var sql = "select * from orderhistory where userid='"+user_name+"'";
  var eshan= connection.query(sql,function(err, rows,fields)

	      {
	   	   if(err)
	   	   console.log("Error Selecting : %s ",err );
	   	   if(rows.length!==0){
	   	   console.log("DATA : "+JSON.stringify(rows));
	   	   //req.session.username=user_name;
	   	   res.render('orderhistory',{productArray:rows,tittle:"My order history",username:req.session.username});
	   	   }
	   	   else
	   	   {
	   	   console.log("inside tesla");
	              res.redirect('/store');
	   	   }

	      });
});

app.post("/buy",function(req,res){
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	var db2= new AWS.DynamoDB();
	 var input = JSON.parse(JSON.stringify(req.body));
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
			 			//tempArray.push(temp[i]);
			 			//console.log("unit cost :" +(temp[i]["unitcost"]["N"]));
			 			//totalcost=totalcost+(parseInt((temp[i]["unitcost"]["N"]))*parseInt((temp[i]["quantity"]["N"])));
			 		
			 		var productID=temp[i]["id"]["S"];
			 		var quantity=temp[i]["quantity"]["N"];
			 		console.log("quanitty" + quantity );
			 		
			 		//putting into order history transaction
			 		var mysql=require('mysql');
				    var connection = mysql.createConnection({
						host: 'test.cb3axxkhhlwq.us-east-1.rds.amazonaws.com',
						user: 'root',
						password: 'password',
						port: '3306',
						database: 'test'
						});
				    
				    var data = {
				            userid    : req.session.username,
				            productid : productID.toString(),
				            costpaid   : (quantity*(temp[i]["unitcost"]["N"])).toString(),
				            card:input.cardnumber.toString()
				        };
				    var query = connection.query("INSERT INTO orderhistory set ? ",data, function(err, rows)
					        {
					          if (err)
					              console.log("Error inserting : %s ",err );
					         
					          //res.redirect('/store/login');
					        });
			 		
			 		var paramsUpdate = {
							  TableName : 'product',
							  "Key":{
								  "id":{
									  "S":productID.toString()
								  }
							  },
							  "AttributeUpdates":{
								  
								
											 "quantity":{
													"Value":{
														"N":(-quantity).toString()  
													},
													"Action":"ADD"
												 }
							  }
							  
						}
					
			 		
			 		
			 	db2.updateItem(paramsUpdate, function(err, data) {
					if (err) {
						console.log(err); // an error occurred
						callback(err);
					}
					else {
						//console.log(data); // successful response
						console.log(data);
					}
				});
			 	var paramsDelte = {
						  'TableName' : 'cart',
						  "Key": {
							  "id":{
								  "S":productID.toString()
							  },
						        "username": {
						            "S": req.session.username
						        }
						    }
					}
				db.deleteItem(paramsDelte, function(err, data) {
				    if (err) {
				      console.log(err); // an error occurred
				      callback(err); 
				    } 
				    else {
				    	
				    	//res.redirect('/store/shoppingcart');
				    }
			});
			 	//console.log(totalcost);
			 	//res.render('shoppingcart',{tittle:'My Store : Shopping Cart',productArray:tempArray,username:req.session.username,cost:totalcost,error:req.params.quantity});
			 		}
			 }
		});
	

	res.redirect("/");

});



//app.get('/logout',product.list);
//app.get('/product',product.list);

app.get('/removefromcart/:id',function(req,res)
		{
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	
			var params = {
					  'TableName' : 'cart',
					  "Key": {
					        "id": {
					            "S": req.params.id
					        },
					        "username": {
					            "S": req.session.username
					        }
					    }
				}
			db.deleteItem(params, function(err, data) {
			    if (err) {
			      console.log(err); // an error occurred
			      callback(err); 
			    } 
			    else {
			    	
			    	res.redirect('/store/shoppingcart');
			    }
});
	

		});


app.post('/addtocart/:id/:productname/:productcost',function(req,res)
		{
	/*
	var ObjectId = require('mongodb').ObjectID;
		var mongoclient=require("mongodb").MongoClient;
		mongoclient.connect("mongodb://localhost:27017/admin",function(err,db)
			{
				if(err){return console.dir(err);}
				 db.collection("cart", function(error,collection){
					 console.log(" we have the product collection");
					 //checking whether the item is already present
					
					var updateResult=collection.update({_id:ObjectId(req.params.id),username:req.session.username}, {$inc: {quantity:1}}, {upsert:true},function(err,db){});
					console.log(updateResult);
						 
					 
				 });
			});
		*/
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	console.log(req.params.productname);
	console.log(req.session.username);
	var temp=req.params.id;
	var id=temp.substring(1,temp.length-1);
	temp=null;
	temp=req.params.productname;
	var product=temp.substring(1,temp.length-1);
	temp=null;
	temp=req.params.productcost;
	var productcost=temp.substring(1,temp.length-1);
	//var randomNumber=Math.floor((Math.random() * 10000) + 1);
	var params = {
			  TableName : 'cart',
			  "Key":{
				  "id":{
					  "S":id
				  },
				  "username":{
					  "S":req.session.username
				  }
			  },
			  "AttributeUpdates":{
				  
				 "quantity":{
						"Value":{
							"N":"1"  
						},
						"Action":"ADD"
					 },
					 "unitcost":{
							"Value":{
								"N":productcost.toString()  
							},
							"Action":"PUT"
						 },
					 "productname":{
							"Value":{
								"S":product  
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
	/*
	backURL=req.header('Referer') || '/';
			
			console.log("url:"+backURL);
			res.redirect(backURL);
			*/
			res.redirect('/');
		});

//app.get('/shoppingcart',shoppingcart.display);
//app.post('/updateshoppingcart',shoppingcart.update);


app.post('/updatecart/:id',function(req,res)
		{
	
	var AWS = require('aws-sdk');
	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAI6ATSKO5IA5QALNA', secretAccessKey: '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'});
	var db = new AWS.DynamoDB();
	
	var temp=req.params.id;
	var id=temp.substring(1,temp.length-1);
	var availablequantity;
	console.log("eshannew ww");
	console.log(req.body.quantityupdate);
	console.log("eshannew ww");
	var paramsAvailableItems = {
		    
			  'TableName' : 'product',
			  "ScanFilter": {
			        "id": {
			            "AttributeValueList": [
			                {
			                    "S": id
			                }
			            ],
			            "ComparisonOperator": "EQ"
			        }
			    }
			  }
	
	db.scan(paramsAvailableItems, function(err, data) {
		 if (err) {
		   console.log(err); // an error occurred
		   } 
		 else
			 {
			 console.log(data);
			 console.log("-----------------------------------");
			 var temp=data["Items"];
			 console.log("eshan"+temp);
			 var tempArray=new Array();
				for(var i=0;i< temp.length;i++)
		 		{
		 			tempArray.push(temp[i]);
		 			
		 		}
				
				availablequantity=tempArray[0]["quantity"]["N"];
				
				//update code
				if(parseInt(req.body.quantityupdate.toString().trim())==0)
					{
					console.log("Avi is inside  delete loop save him");
							var params = {
									  'TableName' : 'cart',
									  "Key": {
									        "id": {
									            "S": id
									        },
									        "username": {
									            "S": req.session.username
									        }
									    }
								}
							db.deleteItem(params, function(err, data) {
							    if (err) {
							      console.log(err); // an error occurred
							      callback(err); 
							    } 
							    else {
							    	
							    	res.redirect('/store/shoppingcart');
							    }
						});
							
							
					}
				else
					{
				if(parseInt(availablequantity)>=parseInt(req.body.quantityupdate.toString().trim()))
				{
					console.log("inside if loop");
					
			
							var params = {
									  TableName : 'cart',
									  "Key":{
										  "id":{
											  "S":id
										  },
										  "username":{
											  "S":req.session.username
										  }
									  },
									  "AttributeUpdates":{
										  
										 "quantity":{
												"Value":{
													"N":req.body.quantityupdate.toString()
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
											
											console.log(data);
											res.redirect('/store/shoppingcart');
										}
									});
										}
							else
								{console.log("shriya");
									//console.log(req.session.availablequantity);
									res.redirect('/store/shoppingcart/updateerror/'+availablequantity);
								} 
						}
			 		}
	});
				});
	


app.get('/testDynamo',function(req,res)
		{
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
					 console.log(data["Items"]);
					 console.log("------------------------------");
					 var temp=data["Items"];
					 var tempArray=new Array();
					 	for(var i=0;i< temp.length;i++)
					 		{
					 			tempArray.push(temp[i]);
					 		}
					 
					 	console.log(tempArray);
					 //var eshan=data["Items"];
				//console.log(data["Items"]);
				/*
					 for(var i=0;i<eshan.length;i++){
					        var obj = eshan[i];
					       var obj2=obj["cost"];
					       console.log(obj2['N']);
					    }
					 */
					 }
				});
			
					 
		});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
