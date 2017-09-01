var express = require('express')
  , router = express.Router();
 var url = require('url');
 var fs = require('fs');
 var path = require('path');
 var multiparty = require('multiparty');

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
		 //ar actualPath = "C:/Users/Prasanthi/Desktop/latest/SampleReactApp";
		 
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
			//var actualPath = "C:/Users/Prasanthi/Desktop/latest/SampleReactApp/";;
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
               			return res.json({"message":event_id});
           					});
      					 }
      				else{
           					return res.json({"message":"eventTitle is already in use"});
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
router.get('/event', function(req, res, next) {
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
            	var getquer= "SELECT * from Event";
                conn.query(getquer, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = ["eventDetails"];
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

router.post('/register', function(req,res,next){
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
			"EmailId" : reqObj.EmailId,
			"Name": reqObj.Name,
			"Password": reqObj.Password,
			"ConfirmPwd": reqObj.ConfirmPwd,
			"Login_type" : 0

			};
			var emailIdReg = reqObj.EmailId;
  			 conn.query('SELECT * FROM Register WHERE EmailId = ?',  [emailIdReg], function(err,result){
    		if(err) {
           		return console.log(err);
       			}
       			if (!result.length)
       			{
           			conn.query(insertSql, insertValues, function(err, result){
              
              		var event_id = "Registered Successfully";
					return res.json({"message":event_id});
          		 });
       			}else{
           		return res.json({"message":"EmailId is already in use"});
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
router.get('/getUserProfile', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
      console.log(query);
        var eventTitle = query.eventTitle;
        var  price= query.price;
        console.log(eventTitle);
        console.log(price);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var getquer= "SELECT * from Register";
                conn.query(getquer, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = ["Register Details"];
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
   "EmailId" : reqObj.EmailId,
   "Name": reqObj.Name,
   "Password": reqObj.Password,
   "ConfirmPwd": reqObj.ConfirmPwd,
   "Login_type" : 1
   
   };
   var emailIdReg = reqObj.EmailId;
   conn.query('SELECT * FROM Register WHERE EmailId = ?',  [emailIdReg], function(err,result){
     if(err){
      return console.log(err);
     }
     if (!result.length)
     {
        conn.query(insertSql, insertValues, function(err, result){
          var event_id = "Registered Successfully";
          return res.json({"message":event_id});
        });
      }
      else{
        return res.json({"message":"EmailId is already in use"});
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
//login manually
router.post('/login', function(req,res,next){
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
				var EmailId = reqObj.EmailId;
				var Password = reqObj.Password;
				var insertSql = "SELECT * from Register where EmailId = ?";

				var query = conn.query(insertSql, [EmailId], function (err, result)
				{
					if(err){
						console.error('SQL error: ', err);
						return next(err);
						}
						else{
    		 					console.log('The solution is: ', result);
    							if(result.length >0)
    							{

     								if(Password == result[0].Password)
     								{
     									console.log("jjjjjjpp",result[0].Password);
        								res.json({
          								"error":200,
          								"message":"Sucessfully Authenticated"
            								});
     	 							}
      								else{
        							res.json({
          							"error":204,
          							"message":"Email and password does not match"
           	 							});
      								}	
      							}
    							else{
      								res.json({
        							 "error":204,
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
				var EmailId = reqObj.EmailId;
				var Password = reqObj.Password;
				var insertSql = "SELECT * from Register where EmailId = ?";

				var query = conn.query(insertSql, [EmailId], function (err, result)
				{
					if(err){
						console.error('SQL error: ', err);
						return next(err);
						}
						else{
    		 					console.log('The solution is: ', result);
    							if(result.length >0)
    							{

     								if(Password == result[0].Password)
     								{
     									console.log("jjjjjjpp",result[0].Password);
        								res.json({
          								"error":200,
          								"message":"Sucessfully Authenticated"
            								});
     	 							}
      								else{
        							res.json({
          							"error":204,
          							"message":"Email and password does not match"
           	 							});
      								}	
      							}
    							else{
      								res.json({
        							 "error":204,
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

//food item API
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
   "Food_item" : reqObj.Food_item,
   "Food_price": reqObj.Food_price,
   "Food_code": reqObj.Food_code,
   "Zipcode": reqObj.Zipcode
   };
       conn.query(insertSql, insertValues, function(err, result){
       
          var event_id = "Added Successfully";
          return res.json({"message":event_id});
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
router.post('/get_food', function(req, res, next) {
    try {
    	
  		var query = url.parse(req.url,true).query;
  		//console.log(query);
  		var reqObj = req.body; 

        
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
            	var Zipcode = reqObj.Zipcode;
            	var getquer= "SELECT * FROM Food WHERE Zipcode= ?";
                conn.query(getquer,Zipcode, function(err, result) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                   if(result.length){
                   
                    var resEmp = ["foodDetails"];

                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        resEmp.push(empObj);
                    }

                    res.json(resEmp);
                }else{
                	return res.json({"message":"No Events "});
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
     //ar actualPath = "C:/Users/Prasanthi/Desktop/latest/SampleReactApp";
     
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
      //var actualPath = "C:/Users/TCST09/Desktop/SampleReactApp/";
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
                    var resEmp = ["dealDetails"];
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


//user register
router.post('/Registeruser', function(req,res,next){
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
      var insertSql = "INSERT INTO Registeruser SET ?";
      var insertValues = {
      "EmailId" : reqObj.EmailId,
      "Name": reqObj.Name,
      "Password": reqObj.Password,
      "ConfirmPwd": reqObj.ConfirmPwd,
      "Login_type" : 0

      };
      var emailIdReg = reqObj.EmailId;
         conn.query('SELECT * FROM Registeruser WHERE EmailId = ?',  [emailIdReg], function(err,result){
        if(err) {
              return console.log(err);
            }
            if (!result.length)
            {
                conn.query(insertSql, insertValues, function(err, result){
              
                  var event_id = "Registered Successfully";
          return res.json({"message":event_id});
               });
            }else{
              return res.json({"message":"EmailId is already in use"});
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

//loginuser
router.post('/loginuser', function(req,res,next){
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
        var EmailId = reqObj.EmailId;
        var Password = reqObj.Password;
        var insertSql = "SELECT * from Registeruser where EmailId = ?";

        var query = conn.query(insertSql, [EmailId], function (err, result)
        {
          if(err){
            console.error('SQL error: ', err);
            return next(err);
            }
            else{
                  console.log('The solution is: ', result);
                  if(result.length >0)
                  {

                    if(Password == result[0].Password)
                    {
                      console.log("jjjjjjpp",result[0].Password);
                        res.json({
                          "error":200,
                          "message":"Sucessfully Authenticated"
                            });
                    }
                      else{
                      res.json({
                        "error":204,
                        "message":"Email and password does not match"
                          });
                      } 
                    }
                  else{
                      res.json({
                       "error":204,
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

//special insertion

router.post('/special', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.AddImages.name).toLowerCase();
     var temp_path = req.files.AddImages.path;
     console.log("jjjjjj",temp_path);
     
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.AddImages.path, function (err, data) {
        var target_path = "SpecialUploads/" + req.files.AddImages.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
    req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }else{
    	var actualPath = "http://52.201.14.137:3000/";
    
      var insertSql = "INSERT INTO special SET ?";
      var insertValues = {
      "Title" : reqObj.Title,
      "Description": reqObj.Description,
      "AddImages":  actualPath + target_path,
      "Location": reqObj.Location,
      "AddButton" : reqObj.AddButton,
      "Date": reqObj.Date
      
      };
    var TitleReg=req.body.Title;
     if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

          conn.query('SELECT * FROM Special WHERE Title = ?',  [TitleReg],function(err,rows){
           if(err){
                    return console.log(err);
                 }
                if (!rows.length)
                {
                   conn.query(insertSql,insertValues,function(err, result){
                   
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
                    var resEmp = ["SpecialDetails"];
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

//job insertion
router.post('/job', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.AddImages.name).toLowerCase();
     var temp_path = req.files.AddImages.path;
     console.log("jjjjjj",temp_path);
     //ar actualPath = "C:/Users/Prasanthi/Desktop/latest/SampleReactApp";
     
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.AddImages.path, function (err, data) {
        var target_path = "JobUploads/" + req.files.AddImages.originalFilename;
        console.log(target_path);
        /// write file to uploads/fullsize folder
        fs.writeFile(target_path, data, function (err) {
        
    req.getConnection(function(err, conn){
    if(err){  
      console.error('SQL Connection error: ', err);
      return next(err);
    }else{
    	var actualPath = "http://52.201.14.137:3000/";
      //var actualPath = "C:/Users/TCST09/Desktop/SampleReactApp/";
      var insertSql = "INSERT INTO Job SET ?";
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

          conn.query('SELECT * FROM Job WHERE Title = ?',  [TitleReg],function(err,rows){
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
                    }
                    var resEmp = ["jobDetails"];
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
