var express = require('express')
  , router = express.Router();
 var url = require('url');
 var fs = require('fs');
 var path = require('path');
 var multiparty = require('multiparty');
 var bcrypt = require('bcrypt');
 var salt = bcrypt.genSaltSync(10);



router.use('/users', require('./users'));
module.exports = router;

//create event service
router.post('/event', function(req, res,next) {
	try{
		var reqObj = req.body;        
		console.log("rrrrrrrr",reqObj);
		console.log("kkkkkk",req.files);
		 var ext = path.extname(req.files.Image.name).toLowerCase();
		 var temp_path = req.files.Image.path;
		 console.log("jjjjjj",temp_path);
				 
    	// move the file from the temporary location to the intended location
    	
		fs.readFile(req.files.Image.path, function (err, data) {
        var target_path = "uploads/" + req.files.Image.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
		req.getConnection(function(err, conn){
		if(err){	
			console.error('SQL Connection error: ', err);
			return next(err);
		}else{
			var actualPath = "http://52.201.14.137:3000/";
	
			var insertSql = "INSERT INTO Event SET ?";
			var insertValues = {
			"eventTitle" : reqObj.eventTitle,
			"Description": reqObj.Description,
			"Time": reqObj.Time,
			"eventLocation": reqObj.eventLocation,
			"price" : reqObj.price,
			"Image" : actualPath + target_path
			
			};
		var eventTitleReg=req.body.eventTitle;
		 if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

   				conn.query('SELECT * FROM Event WHERE eventTitle = ?',  [eventTitleReg],function(err,rows){
   				 if(err){
           					return console.log(err);
       					 }
       					if (!rows.length)
       					{
          				 conn.query(insertSql,insertValues,function(err, result){
              		
               			var event_id = "Inserted Successfully";
               			return res.json({"error":200,
               				"message":event_id});
           					});
      					 }
      				else{
           					return res.json({"error":400,
           						"message":"eventTitle is already in use"});
      					 }
   			});
		}
		else{
			console.log('File type must be image',err);
             res.json({"message": 'Only image files are allowed.'});
			}

		}
		});
	});
		});
}
catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});
		
/* Get event Service. */
router.post('/getEvent', function(req, res, next) {
    try {
      
    var query = url.parse(req.url,true).query;
    console.log(query);
        var reqObj = req.body; 
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var eventLocation = reqObj.eventLocation;
              var getquer= 'SELECT * FROM Event WHERE eventLocation = ?';
                conn.query(getquer,eventLocation, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                   if(result.length){
                   
                    var eventDetails= [];

                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        eventDetails.push(empObj);
                    }

                    res.json({"status":200,eventDetails});
                }else{
                  return res.json({"error":400,"message":"No Events "});
                }

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//delete event
router.post('/delete',function(req, res, next){
	try{
		var reqObj = req.body;     
		console.log(reqObj);
		req.getConnection(function(err, conn){
			if(err){
				console.error('SQL Connection error:' ,err);
				return next(err);
			}else{
				var deletequery=" DELETE from Event where ?";
				var deleteVal = {
            		"eventTitle" : reqObj.eventTitle
            	};
				conn.query(deletequery, deleteVal, function(err, result){
					if(err){
						console.error('SQL error:' , err);
						return next(err);
					}

					console.log(result);
					var deleteId="Deleted Succesfully";
					res.json({"message":deleteId});
				});
			}
		});
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
}

});
//register manually
router.post('/register', function(req,res,next){
try{
  var reqObj = req.body;        
  console.log(reqObj);
  console.log("kkkkkk",req.files);
     var ext = path.extname(req.files.profilePhoto.name).toLowerCase();
     var temp_path = req.files.profilePhoto.path;
     console.log("jjjjjj",temp_path);
         
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.profilePhoto.path, function (err, data) {
        var target_path = "uploads/" + req.files.profilePhoto.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err){
          req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }
    else
    {
      
      var actualPath = "http://52.201.14.137:3000/";
      var insertValues = {
      "emailId" : reqObj.emailId,
      "name": reqObj.name,
      "password": hash,
      "loginType" : reqObj.loginType,
      "address": reqObj.address,
      "website": reqObj.website,
      "time": reqObj.time,
      "phone": reqObj.phone,
      "profilePhoto": actualPath + target_path,
      "socialmediaLinks": reqObj.socialmediaLinks
      };
      
      var insertSql = "INSERT INTO Register SET ?";
      var emailIdReg = reqObj.emailId;
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
            {
         conn.query('SELECT * FROM Register WHERE emailId = ?',  [emailIdReg], function(err,result){
        if(err) {
                  return console.log(err);
                }
                if (!result.length)
                {
                conn.query(insertSql, insertValues, function(err, result){
                var event_id = "Registered Successfully";
                return res.json({
                  "status":200,
                  "message":event_id});
                     });
            }else{
                  return res.json({"error":401,
                  "message":"Email is already Registered"});
                  }
          });
         }
    else{
      console.log('File type must be image',err);
             res.json({"error":400,"message": 'Only image files are allowed.'});
      }
      

    }
    });
  });
  });
  }catch(ex){
  console.error("Internal error:"+ex);
  return next(ex);
  }
});



//login manually
router.post('/login', function(req, res, next) {
    try {
      
      var reqObj = req.body; 
        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
            
              var emailId = reqObj.emailId;
              var password=reqObj.password;
              var loginType= reqObj.loginType;
              var getquery = "SELECT * FROM Register WHERE emailId='" + emailId + "' AND password='" + password+ "' and loginType='" + loginType+ "'";
                var query = conn.query(getquery, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                   
                   if(result.length){
                   console.log("llll",query.sql);
                
                    for (var empIndex in result) {

                        var userInfo = result[empIndex];
                      }

                    res.json({"status":200,
                      "message":"Authenticated Successfully",userInfo});
                }else{
                  return res.json({"error":401,
                    "message":"Invalid Credentails"});
                }  
        });

    }
    });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


/* when user login with facebook. */
router.post('/register/facebook', function(req,res,next){
try{
 var reqObj = req.body;        
 console.log(reqObj);
 req.getConnection(function(err, conn){
  if(err){ 
   console.error('SQL Connection error: ', err);
   return next(err);
  }
  else
  {
   console.log(insertValues);
   var insertSql = "INSERT INTO Register SET ?";
   var insertValues = {
   "emailId" : reqObj.emailId,
   "name": reqObj.name,
   "password": reqObj.password,
   "login_type" : 1
   
   };
   var emailIdReg = reqObj.emailId;
   conn.query('SELECT * FROM Register WHERE emailId = ?',  [emailIdReg], function(err,result){
     if(err){
      return console.log(err);
     }
     if (!result.length)
     {
        conn.query(insertSql, insertValues, function(err, result){
          var event_id = "Registered Successfully";
          return res.json({
            "status":200,
            "message":event_id});
        });
      }
      else{
        return res.json({"error":401,
          "message":"Either of Email or Name is already Registered"});
      }     
    });
  }
  });
 }
 catch(ex){
 console.error("Internal error:"+ex);
 return next(ex);
 }
});

//login with fb
router.post('/login/facebook', function(req,res,next){
try{
    var reqObj = req.body;        
    console.log(reqObj);
    req.getConnection(function(err, conn)
    {
      if(err)
      { 
      console.error('SQL Connection error: ', err);
      return next(err);
      }
      else
      {
        var emailId = reqObj.emailId;
        var password = reqObj.password;
        var login_type = reqObj.login_type;

        var insertSql = "SELECT * from Register where login_type= ?";

        var query = conn.query(insertSql, [login_type], function (err, result)
        {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
            }
            else{
                  console.log('The solution is: ', result);
                  if(result.length >0)
                  {

                    if(password == result[0].password)
                    {
                      console.log("jjjjjjpp",result[0].password);
                        res.json({
                          "status":200,
                          "message":"Sucessfully Authenticated"
                            });
                    }
                      else{
                      res.json({
                        "error":400,
                        "message":"Email and password does not match"
                          });
                      } 
                    }
                  else{
                      res.json({
                       "error":401,
                       "message":"Email does not exits"
                          });
                    }
                }
        });
      }
    });
  }catch(ex){
  console.error("Internal error:"+ex);
  return next(ex);
  }
});

//insert food 
router.post('/food', function(req,res,next){
try{
 var reqObj = req.body;        
 console.log(reqObj);
 req.getConnection(function(err, conn){
  if(err){ 
   console.error('SQL Connection error: ', err);
   return next(err);
  }
  else
  {
   console.log(insertValues);
   var insertSql = "INSERT INTO Food SET ?";
   var insertValues = {
   "foodItem" : reqObj.foodItem,
   "foodPrice": reqObj.foodPrice,
   "foodCode": reqObj.foodCode,
   "zipcode": reqObj.zipcode
   };
       conn.query(insertSql, insertValues, function(err, result){
  if(!result.lenghth){
       
          var event_id = "Added Successfully";
          return res.json({"status":200,"message":event_id});
  }else{
    return res.json({"error":400,"message":"Please try again.."});
  }
      });
     
      }
      

  });
 }
 catch(ex){
 console.error("Internal error:"+ex);
 return next(ex);
 }
});

//Get items
router.post('/getFood', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
      //console.log(query);
      var reqObj = req.body; 

        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var zipcode = reqObj.zipcode;
              var getquer= "SELECT * FROM Food WHERE zipcode= ?";
                conn.query(getquer,zipcode, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                   if(result.length){
                   
                    var foodDetails= [];

                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        foodDetails.push(empObj);
                    }

                    res.json({"status":200,foodDetails});
                }else{
                  return res.json({"error":400,"message":"No foodDetails for this location "});
                }

                });

            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//deal insertion
router.post('/deal', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.AddImages.name).toLowerCase();
     var temp_path = req.files.AddImages.path;
     console.log("jjjjjj",temp_path);

      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.AddImages.path, function (err, data) {
        var target_path = "DealUploads/" + req.files.AddImages.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
    req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }else{
    	var actualPath = "http://52.201.14.137:3000/";
    
      var insertSql = "INSERT INTO Deal SET ?";
      var insertValues = {
      "Title" : reqObj.Title,
      "Description": reqObj.Description,
      "AddImages":  actualPath + target_path,
      "Location": reqObj.Location,
      "AddButton" : reqObj.AddButton
      
      };
    var TitleReg=req.body.Title;
     if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

          conn.query('SELECT * FROM Deal WHERE Title = ?',  [TitleReg],function(err,rows){
           if(err){
                    return console.log(err);
                 }
                if (!rows.length)
                {
                   conn.query(insertSql,insertValues,function(err, result){
                     //conn.end();
                    var deal_id = "Inserted Successfully";
                    return res.json({"message":deal_id});
                    });
                 }
              else{
                    return res.json({"message":"Title is already in use"});
                 }
        });
    }
    else{
      console.log('File type must be image',err);
             res.json({message: 'Only image files are allowed.'});
      }

    }
    });
  });
    });
    // });
}
catch(ex){
  console.error("Internal error:"+ex);
  return next(ex);
  }
});

//get Deal

router.get('/deal', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
      console.log(query);
        var Title = query.Title;
        //var price= query.price;
        console.log(Title);
        //console.log(price);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var getquer= "SELECT * from Deal";
                conn.query(getquer, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = ["Deal Details"];
                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//special insertion

router.post('/special', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.addImages.name).toLowerCase();
     var temp_path = req.files.addImages.path;
     console.log("jjjjjj",temp_path);
     
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.addImages.path, function (err, data) {
        var target_path = "SpecialUploads/" + req.files.addImages.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
    req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }else{
      var actualPath = "http://52.201.14.137:3000/";
    
      var insertSql = "INSERT INTO Special SET ?";
      var insertValues = {
      "title" : reqObj.title,
      "description": reqObj.description,
      "addImages":  actualPath + target_path,
      "location": reqObj.location,
      "addButton" : reqObj.addButton,
      "date": reqObj.date
      
      };
    var TitleReg=req.body.title;
     if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

          conn.query('SELECT * FROM Special WHERE title = ?',  [TitleReg],function(err,rows){
           if(err){
                    return console.log(err);
                 }
                if (!rows.length)
                {
                   conn.query(insertSql,insertValues,function(err, result){
                   
                    var deal_id = "Inserted Successfully";
                    return res.json({"status":200,"message":deal_id});
                    });
                 }
              else{
                    return res.json({"error":401,"message":"title is already in use"});
                 }
        });
    }
    else{
      console.log('File type must be image',err);
             res.json({"error":400,"message": 'Only image files are allowed.'});
      }

    }
    });
  });
    });
    // });
}
catch(ex){
  console.error("Internal error:"+ex);
  return next(ex);
  }
});


/* Get event Service. */
router.get('/special', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
      console.log(query);
        var eventTitle = query.eventTitle;
        var  price= query.price;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var getquer= "SELECT * from Special";
                conn.query(getquer, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
    if(result.length){
                    var specialDetails= [];
                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        specialDetails.push(empObj);
                    }
                    res.json({"status":200,specialDetails});
    }else{
                  return res.json({"error":400,"message":"No specialDetails"});
                }

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


//job insertion
router.post('/job', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.addImages.name).toLowerCase();
     var temp_path = req.files.addImages.path;
     console.log("jjjjjj",temp_path);
        
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.addImages.path, function (err, data) {
        var target_path = "JobUploads/" + req.files.addImages.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
    req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }else{
      var actualPath = "http://52.201.14.137:3000/";
    
      var insertSql = "INSERT INTO Job SET ?";
      var insertValues = {
      "title" : reqObj.title,
      "description": reqObj.description,
      "addImages":  actualPath + target_path,
      "location": reqObj.location,
      "addButton" : reqObj.addButton
      
      };
    var TitleReg=req.body.title;
     if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

          conn.query('SELECT * FROM Job WHERE title = ?',  [TitleReg],function(err,rows){
           if(err){
                    return console.log(err);
                 }
                if (!rows.length)
                {
                   conn.query(insertSql,insertValues,function(err, result){
                     //conn.end();
                    var deal_id = "Inserted Successfully";
                    return res.json({"status":200,"message":deal_id});
                    });
                 }
              else{
                    return res.json({"error":401,"message":"title is already in use"});
                 }
        });
    }
    else{
      console.log('File type must be image',err);
             res.json({"error":400,"message": 'Only image files are allowed.'});
      }

    }
    });
  });
    });
    // });
}
catch(ex){
  console.error("Internal error:"+ex);
  return next(ex);
  }
});

//get job

router.get('/job', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var getquer= "SELECT * from Job";
                conn.query(getquer, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }if(result.length){
                    var jobDetails= [];
                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        jobDetails.push(empObj);
                    }
                    res.json({"status":200,jobDetails});
    }else{
                  return res.json({"error":400,"message":"No jobDetails"});
                }

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

