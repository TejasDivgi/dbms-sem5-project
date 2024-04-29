
import  nodemailer from "nodemailer"
import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
const pool = mysql.createPool({
  host: "localhost",
  user: "sqluser",
  password:"password",
  database:"authdb",
  connectionLimit:5
})

const app = express();
const port = 3000;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true}
));

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service : 'Gmail',
  
  auth: {
    user: 'chunnudev.77@gmail.com',
    pass: 'aligbtiliamwccnf',
  }
  
});

/*var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
*/
global.otp=0;
global.email;
global.cname;
global.cname2;
global.name2;
global.sname;
global.postid=0;
global.postid2=0;
var Pid=0;

app.get("/", (req, res) => {

  res.render("home.ejs", {
  });
});
app.get("/register", (req, res) => {

    res.render("register.ejs", {
    });
  });
  app.get("/login", (req, res) => {

    res.render("login.ejs", {
    });
  });
  app.get("/teacher", (req, res) => {

    res.render("teacher.ejs", {
    });
  });
  app.get("/student", (req, res) => {

    res.render("student.ejs", {
    });
  });
  app.get("/resetpassword", (req, res) => {

    res.render("forgotpasse.ejs", {
    });
  });
  

  app.post("/register", (req, res) => {
     Pid++;
     const Email = req?.body?.username;
     const Password =  req?.body?.password;
     const Fname = req?.body?.fname;
     const Lname = req?.body?.lname;
     console.log(`Email is: ${Email}`);
    pool.query("INSERT INTO credentials (Email,Password,Pid,Fname,Lname) VALUES (?,?,?,?,?)", [Email,Password,Pid,Fname,Lname], (err, result) =>{
        if(err) console.log(err);
        else
        res.render("login.ejs");
    })
   
  });

  app.post("/forgotpasse", (req, res) => {
   
    const Email = req?.body?.email;
    
      global.email=Email;
      var otp = Math.random();
                  otp = otp * 1000000;
                  otp = parseInt(otp);
                  global.otp=otp;
                  console.log(global.otp);

                  var mailOptions={
                    to: Email,
                   subject: "Password Reset: ",
                   html: "<h3>OTP To Confirm Password Reset is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
                 };
                 
                 transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                   
                   res.render("OTP1.ejs");}); 
 });
  
  app.post("/forgotpass", (req, res) => {
    
     const Email=global.email;
     const newpass = req?.body?.ppass;
     const conpass = req?.body?.cpass;
     if(newpass==conpass){
    pool.query(`UPDATE  authdb.credentials SET Password = "${conpass}" WHERE Email ="${Email}"`, (err, result) =>{
        if(err) console.log(err);
        else
        res.render("login.ejs");
    })
  }
  else{
    res.send("Password Does not match !");
  }
  });

  app.post("/login", (req,res)=>{
    const Email = req?.body?.username;
    const Password = req?.body?.password;
    if(Email && Password ){

     pool.query(`SELECT * FROM authdb.credentials WHERE Email = "${Email}"`, function(error, data){
        //console.log(data);
        if(data?.length>0){

            for(var count = 0; count<data.length; count++){
                if(data[count].Password == Password)
                {
                  var otp = Math.random();
                  otp = otp * 1000000;
                  otp = parseInt(otp);
                  global.otp=otp;
                  console.log(global.otp);

                  var mailOptions={
                    to: Email,
                   subject: "Account verification: ",
                   html: "<h3>OTP For Account Verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
                 };
                 
                 transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                 
                   res.render("otp.ejs");});
                }
                else{
                    res.send("Incorrect Password !!");
                }
            }
        }
        else{
            res.send("Incorrect Email Address !!");
        }
     })

    }
    else{
        res.send("Please Enter Your Credentials !");
        res.end();
    }
  })
  
 app.post("/OTP1", (req, res) => {
 
  const Otp = req?.body?.OTP;
  if(Otp){
    if(Otp==global.otp){
      res.render("forgotpass.ejs");
    }
    else{
      res.send("Invalid OTP !");
    }
  }
  else{
    res.send("Please enter OTP !");
  }

});


app.post("/otp", (req, res) => {
  Pid++;
  const Otp = req?.body?.OTP;
  if(Otp){
    if(Otp==global.otp){
    
      res.render("studentteacher.ejs");
    }
    else{
    
      res.send("Invalid OTP !");
    }
  }
  else{
 
    res.send("Please enter OTP !");
  }

});
 app.post("/teacher", (req, res) => {
  var cn,p;
  const Name = req?.body?.className;
  const Post =  req?.body?.announcement;
  const Attach =  req?.body?.attachment;
  if(Name)global.cname=Name;
  cn = global.cname;
  global.postid++;
  p=global.postid;
  console.log(`Name is : ${global.cname}`);
  
  console.log(`Post is : ${Post}`);
  console.log(`Attachment is : ${Attach}`);
  //console.log(`Email is: ${Email}`);
 
 pool.query("INSERT INTO announcements2 (className,Post,Attachments,Postid) VALUES (?,?,?,?)", [cn,Post,Attach,p], (err, result) =>{
     if(err) console.log(err);
     else
     res.render("teacher.ejs");
 })
 
/*pool.query(`SELECT className,Post,Attachments FROM announcements2 `, function(error, data){
if(error) console.log(error);
else{
if(data?.length>0){
 res.json(data);
}
}
})
*/
});

app.post("/student", (req, res) => {
   
  var p,cn;
  
  const Name = req?.body?.className;
  const Post =  req?.body?.announcement;
  if(Name)global.cname2=Name;
  cn = Name;
  global.postid++;
  p=global.postdid;

  console.log(`Name is : ${cn}`);
  console.log(`Post is : ${Post}`);
  
  pool.query("INSERT INTO authdb.announcements1 (className,Post) VALUES (?,?)", [cn,Post], (err, result) =>{
    if(err) console.log(err);
    else
    res.render("student.ejs");
})

});
app.post("/student", (req, res) => {
  pool.query(`SELECT className,Post FROM announcements1 `, function(error, data){
    if(error) console.log(error);
    else{
    if(data?.length>0){
     res.json(data);
    }
    }
    })
    });
    

    app.post("/teacher", (req, res) => {
      pool.query(`SELECT className,Post,Attachments FROM announcements2 `, function(error, data){
        if(error) console.log(error);
        else{
        if(data?.length>0){
         res.json(data);
        }
        }
        })
        });

/*
app.get("/login", (req, res) => {

    res.render("login.ejs", {
    });
  });
  app.get("/choice", (req, res) => {

    res.render("teacherstudent.ejs", {
    });
  });
  
  app.get("/otp", (req, res) => {

    res.render("otp.ejs", {
    });
  });*/
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
