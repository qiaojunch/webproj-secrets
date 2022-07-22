//jshint esversion:6
//require("dotenv").config();   // configure your secret info
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');   // encrypt password with hashing and salting
const saltRounds = 10;


const app = express();

// to serve static file such as css, html, images, js files
app.use(express.static("public"));
// setup using ejs
app.set("view engine", "ejs");
// setup using bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// to connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// to use mongoose: create a model
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//userSchema.plugin( encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]} );

const User = mongoose.model("User", userSchema);

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
    // hashing and salting user password
    bcrypt.hash(req.body.username, saltRounds, function(err, hash){
        // create user info
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        // save user info in database
        newUser.save(function(err){
            if(err){
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });

});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            bcrypt.compare(password, foundUser.hash, function(err, result){
                res.render("secrets");
            });
        }
    })
});




app.listen(3000, function(){
    console.log("Server setup successfully on port 3000");
});
