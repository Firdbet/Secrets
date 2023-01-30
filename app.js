
require('dotenv').config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");


const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://firdbet:firdbet123@cluster0.zrjxdpx.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/register", function(req, res){
    const newUser = new User ({
        fullName: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err) {
            console.log(err);
        } else {
            res.render("secrets");
        }

    });
});

app.post("/login", function(req, res){
    User.findOne({email: req.body.email}, function(err, foundResult){
        if(!err) {
            if(foundResult) {
                if(foundResult.password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.render("login");
                }
            }
        }
    });
});

app.get("/logout", function(req, res){
    res.render("login");
});

app.listen(3000, function(){
 console.log("Server started on port 3000");
});