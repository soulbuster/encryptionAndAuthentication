//jshint esversion:6
require('dotenv').config(); // here, level 3
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY); // level 3

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
useNewUrlParser: true,
useUnifiedTopology: true
});


//___________________________________this code works for normal model or database___________________________
// const userSchema = {  // level 1
//   email: String,
//   password: String
// };
//__________________________________________________________________________________________________________

//_______________________________________for encryption_____________________________________________________
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

//const secret = "Thisisourlittlesecrets."; // level 2
//userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});
//adding pugins for encryptions wrt secrets and passwords
// this will encypt when we will hit save and decrypt when we call find.
//now passwords get converted into 2 fields with diff name nad encrypted in binary. ty


 // this is level 3
 // this is security breech.
 // if hacker gets into app.js he may be able to use the same function mentioned below and use this secrets code
 // to decrypt this encripted code so to overcome this we may use enviromental variable.
 // require npm i dotenv also reads its documents
 // call it on line 1
 //create .env file in root directory it's like .gitignore format NAME=VALUE no space and in same format.
 // and when we will upload all these files to remote we will use .gitignore to ignore or hide .env  file.

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

//___________________________________________________________________________________________________________
const user = new mongoose.model("user", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new user({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  user.findOne({email: username}, function(err,result){
    if(err){
      console.log(err)
    }else{
      if(result){
        if(result.password=== password){
          res.render("secrets")
        }
      }
    }
  })
})







app.listen(3000, function() {
  console.log("Server started.");
});
