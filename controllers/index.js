var express = require('express')
  , router = express.Router();
 var url = require('url');
 var fs = require('fs');

 var path = require('path');
 var multiparty = require('multiparty');
 var bcrypt = require('bcrypt');

 var Cryptr = require('cryptr'),
    cryptr = new Cryptr('password');
 // Hash the password with the salt

router.use('/users', require('./users'));
module.exports = router;

//create event service
router.post('/saveEvent', function(req, res,next) {
  try{
      var reqObj = req.body;        
      console.log("rrrrrrrr",reqObj);
      console.log("kkkkkk",req.files);
      var ext = path.extname(req.files.image.name).toLowerCase();
      var temp_path = req.files.image.path;
      console.log("jjjjjj",temp_path);
        
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.image.path, function (err, data) {
        var target_path = "uploads/" + req.files.image.originalFilename;
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
      "description": reqObj.description,
      "time": reqObj.time,
      "eventLocation": reqObj.eventLocation,
      "price" : reqObj.price,
      "image" : actualPath + target_path
      
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
                    return res.json({"status":200,
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
router.get('/getAllEvents', function(req, res, next) {
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
               if(result.length){
                    var eventDetails= [];
                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        eventDetails.push(empObj);
                    }
                    res.json({"status":200,eventDetails});
              }else{
                  return res.json({"error":400,"message":"No eventDetails"});
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
          res.json({"status":200,"message":deleteId});
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
  var encryptedString = cryptr.encrypt(reqObj.password);
     console.log("sss",encryptedString );
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
      "password": encryptedString,
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
          var selectQuery= conn.query('SELECT * FROM Register WHERE emailId = ?',  [emailIdReg], function(err,result){
          if(err) {
                  return console.log(err);
                  }
                  if (!result.length)
                  {
                    var query= conn.query(insertSql,insertValues, function(err, result){
                    if(err){
                    return console.error("SQL error:"+err);
                  }
                  console.log("RegisterQuery",query.sql);
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
          var encryptedString = cryptr.encrypt(reqObj.password);
          var decryptedString = cryptr.decrypt(encryptedString);
          console.log("sssll",encryptedString);
          console.log("dddll",decryptedString);
          req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var emailId = reqObj.emailId;
              var password= decryptedString;
              var loginType= reqObj.loginType;
              var getquery = "SELECT userId,emailId,name,loginType,address,website,time,phone,profilePhoto,socialmediaLinks FROM Register WHERE emailId='" + emailId + "' AND password='" + encryptedString + "' and loginType='" + loginType+ "'";
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
router.post('/getProfile', function(req, res, next) {
    try {
          var reqObj = req.body; 
          req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
              var emailId = reqObj.emailId;
              
              var getquery = "SELECT userId,emailId,name,loginType,address,website,time,phone,profilePhoto,socialmediaLinks FROM Register WHERE emailId='" + emailId + "'";
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
                      "message":"User Profile",userInfo});
                }else{
                  return res.json({"error":401,
                    "message":"Not found such emailId"});
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
   var insertSql = "INSERT INTO Register SET ?";
   var insertValues = {
   "emailId" : reqObj.emailId,
   "name": reqObj.name,
   "password": reqObj.password,
   "loginType" : 1
   
   };
   console.log(insertValues);
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
        var loginType = reqObj.loginType;

        var insertSql = "SELECT * from Register where loginType= ?";

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
   var insertSql = "INSERT INTO Food SET ?";
   var insertValues = {
   "foodItem" : reqObj.foodItem,
   "foodPrice": reqObj.foodPrice,
   "foodCode": reqObj.foodCode,
   "zipcode": reqObj.zipcode
   };
   console.log(insertValues);
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

router.post('/deal', function(req, res,next) {
  try{
    var reqObj = req.body;        
    console.log("rrrrrrrr",reqObj);
    console.log("kkkkkk",req.files);
    var ext = path.extname(req.files.addImages.name).toLowerCase();
     var temp_path = req.files.addImages.path;
     console.log("jjjjjj",temp_path);
     
      // move the file from the temporary location to the intended location
      
    fs.readFile(req.files.addImages.path, function (err, data) {
        var target_path = "DealUploads/" + req.files.addImages.originalFilename;
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
      "title" : reqObj.title,
      "description": reqObj.description,
      "addImages":  actualPath + target_path,
      "location": reqObj.location,
      "addButton" : reqObj.addButton,
      
      };
    var TitleReg=req.body.title;
     if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
          {

          conn.query('SELECT * FROM Deal WHERE title = ?',  [TitleReg],function(err,rows){
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

//get Deal

router.get('/deal', function(req, res, next) {
    try {
      
      var query = url.parse(req.url,true).query;
      console.log(query);
        var title = query.title;
        //var price= query.price;
        console.log(title);
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
          if(result.length){
                    var dealDetails= [];
                    for (var empIndex in result) {
                        var empObj = result[empIndex];
                        dealDetails.push(empObj);
                    }
                    res.json({"status":200,dealDetails});
            }else{
                  return res.json({"error":400,"message":"No dealDetails"});
               

      }
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
      //var actualPath = "C:/Users/TCST09/Desktop/SampleReactApp/";
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

