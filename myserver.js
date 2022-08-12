var express= require("express");
var app=express();
var fileuploader=require("express-fileupload");
var mysql=require("mysql");

var path= require("path");

app.listen(2001,function(){
    console.log("Server Started");

});

//used to serve .js and .css files from public folder
app.use(express.static("public"));

app.get("/",function(req,resp)
{
    //resp.send("Its Home Page");

    var puraPath=process.cwd()+"/public/index.html";

    //global object : process
    resp.sendFile(puraPath);
});

//=======DATABASE CONNECTION===========

var dbConfiguration={
    host:"localhost",//fixed
    user:"root",//pwd
    password:"", //""
    database:"medicine" //ur own database name 
}

var refDB=mysql.createConnection(dbConfiguration);
refDB.connect(function(errKuch)
{
    if(errKuch)
        console.log(errKuch);
    else
        console.log("DATABASE CONNECTED....");
});

app.get("/dosignup",function(req,resp){
    var dataAry=[req.query.txtEmail,req.query.txtpwd,req.query.combo];
    // console.log(req.query.txtEmail);
    // console.log(req.query.txtpwd); 
    // console.log(req.query.combo); 
    refDB.query("insert into users values(?,?,?,1)",dataAry,function(err,respAryOfObjects){
        if(err){
            resp.send(err);
        console.log("$$$$$$$$$$$$$$$$$");
        
        }
        else{
            resp.send(respAryOfObjects);
        console.log("**************");
    
        }
    });

});

app.get("/dologin",function(req,resp){
    refDB.query("select * from users where email=? and pwd=?",[req.query.txtEmail,req.query.txtpwd],
    function(err,respAryOfObjects){
        if(err){
            resp.send("Invalid");
        console.log("LOgin$$$$$$$$$$$$");
        
        }
        else{
            resp.send(respAryOfObjects);
        console.log("Login*********");
    
        }
    })
})

app.get("/dosetting",function(req,resp){
    refDB.query("select * from users where email=? and pwd=?",[req.query.txtEmail,req.query.txtoldpwd],function(err,respAryOfObjects){
        if(err)
        {
            resp.send(err);
        }
        else
        if(respAryOfObjects.lenght==0)
        resp.send("invalid");
        else{
            refDB.query("update users set pwd=? where email=?",[req.query.txtnewpwd,req.query.txtEmail],function(err,result){
                if(err)
                resp.send(err);
                else
                {
                    resp.send("updated!!");
                    console.log(req.query.txtnewpwd);
                }
                
            })
        }
        
    })
})

app.get("/doprofilesearch",function(req,resp)
{
    refDB.query("select * from dprofile where emailid=?",[req.query.txtEmail],function(err,respAryOfObjects){
        if(err)
        {
            console.log(err);
            resp.send(err);
        }

        else
        {
            resp.send(respAryOfObjects);
            console.log("***PRofile SEarched**");
        }
    })
})
//===============================================================
app.use(fileuploader());

app.post("/submit-profile",function(req,resp){
    console.log("chalgya v");
    var fname=req.body.txtEmail+"-"+req.files.picprofile.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.picprofile.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");

        })

        var ary=[req.body.txt];



        resp.send("Done hai");


});

app.post("/list-medicine",function(req,resp){
    // console.log("control toh aara");
    var dataAry=[req.body.txtEmail,req.body.txtmedname,req.body.txtpack,req.body.txtqty,req.body.txtdate,req.body.txtcomp,'baadmai.jpg','desciptions will be added soon'];
    refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,CURRENT_DATE())",dataAry,function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send("Your Medicine Donated");
    })
    
})

app.get("/fetchAllRecords",function(req,resp){
    refDB.query("select * from users", function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
        // console.log(result);
    })
    
})

//all is used to process both post and get requests
app.all("/admin-doaction",function(req,resp){
    refDB.query("update users set status =? where email=?",[req.query.statusid,req.query.emailid],function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.all("/admin-donors",function(req,resp){
    refDB.query("select * from dprofile",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result); 
    })
})

app.all("/admin-donor-delete",function(req,resp){
    refDB.query("delete from dprofile where emailid=?",[req.query.emailid],function(err,result){
        if(err)
        resp.send(err);
        else
        {
            // console.log("hii control is here");
            resp.send(result);   
        }
        
    })
})

app.all("/fetchAllCities",function(req,resp){
    refDB.query("select distinct city from dprofile",function(err,result){
        if(err)
        resp.send(err);
        else resp.send(result);
    })
})

app.get("/FillMedicines",function(req,resp){
    // console.log(req.query.yecity);
    refDB.query("select * from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.yecity],function(err,result){
        if(err)
        resp.send(err);
        else resp.send(result);
    })
})

//=========================================================================
// app.get ("/fetchCities",function(req,resp){
//     refDB.query("select distinct city from dprofile ",function(err,resultAryOfObjects)
//     {
//          if(err)
//              resp.send(err);
            
//          else
//              resp.send(resultAryOfObjects);;
//     })
// })
// app.get ("/fetchMedicine",function(req,resp){
//     refDB.query("select * from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.cityx],function(err,resultAryOfObjects)
//     {
//          if(err)
//              resp.send(err);
            
//          else
//              resp.send(resultAryOfObjects);;
//     })
// })

// app.get("/fetchSomeRecords",function(req,resp)
// {
//     refDB.query("select * from medicines where medicine=?",[req.query.medicine],function(err,resultAryOfObjects)
//     {
//          if(err)
//              resp.send(err);
            
//          else
//              resp.send(resultAryOfObjects);;
//     })

// })

// app.get ("/fetchInfo",function(req,resp){
//     refDB.query("select * from dprofile ",function(err,resultAryOfObjects)
//     {
//          if(err)
//              resp.send(err);
            
//          else
//              resp.send(resultAryOfObjects);;
//     })
// })

//===============================================================================

app.get("/fetchcity",function(req,res){
    refDB.query("select distinct city from dprofile",function(err,resultcity){
        console.log(resultcity);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultcity);
            res.send(resultcity);
        }
    })
})

app.get("/fetchmed",function(req,res){
    refDB.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.email where dprofile.city=?",[req.query.city],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})

app.get("/fetchdonor",function(req,res){
    // refDB.query("select * from dprofile inner join medicines on dprofile.email=medicines.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,response){
    //     if(err)
    //     {
    //         res.send(err);
    //     }
    //     else
    //     {
    //         res.send(response);
    //     }
    // })

    refDB.query("select dprofile.* , medicines.* from dprofile join medicines on dprofile.email=medicines.emailid where dprofile.city=? and medicine=?",[req.query.city,req.query.med],function(err,response){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(response);
        }
    })
})

app.get("/fetchdetails",function(req,res){
    refDB.query("select dprofile.* , medicines.* from dprofile join medicines on dprofile.email=medicines.emailid where email=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(result);
        }
    })
})

app.get("/fetchAllmeds",function(req,res){
    refDB.query("select * from medicines where emailid=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result)
        }
    })
})
