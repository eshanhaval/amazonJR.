//Add new user	
exports.save = function(req,res){
	    var input = JSON.parse(JSON.stringify(req.body));
	    var mysql=require('mysql');
	    var connection = mysql.createConnection({
			host: 'test.cb3axxkhhlwq.us-east-1.rds.amazonaws.com',
			user: 'root',
			password: 'password',
			port: '3306',
			database: 'test'
			});
	    
	    	var data = {
	            user_name    : input.name,
	            user_password : input.password,
	            user_email   : input.email
	        };
	    	
	        var query = connection.query("INSERT INTO users set ? ",data, function(err, rows)
	        {
	          if (err)
	              console.log("Error inserting : %s ",err );
	         
	          res.redirect('/store/login');
	        });
	};
	
	exports.login=function(req,res){
		res.render("login");
	};

//Validate a user
exports.validate=function(req,res){
	  var input = JSON.parse(JSON.stringify(req.body));
	    var mysql=require('mysql');
	    var connection = mysql.createConnection({
			host: 'test.cb3axxkhhlwq.us-east-1.rds.amazonaws.com',
			user: 'root',
			password: 'password',
			port: '3306',
			database: 'test'
			});
	    
	           var user_name    = input.login;
	            var user_password = input.password;
	    console.log("username="+user_name);
	    console.log("password="+user_password);
	            var sql = "select * from users where user_name='"+user_name+"' and user_password ='" +user_password+"'" ;
	     var eshan= connection.query(sql,function(err, rows,fields)
	    		  {
	    	  			
	    	   			if(err)
	    	   				console.log("Error Selecting : %s ",err );
	    	   			
	    	   			if(rows.length!==0){
	    	   				console.log("DATA : "+JSON.stringify(rows));
	    	   				//console.log("inside tesla");
	    	   				req.session.username=user_name;
	    	   				res.redirect('/store');
	    	   			}
	    	   			else
	    	   				{
	    	   				console.log("inside tesla");
	    		          res.redirect('/store');
	    	   				}
	    		  });
	    		    
	    
	    
	   }