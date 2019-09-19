const express = require("express");
const router=express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware");


//landing page
router.get("/",(req,res)=>{
	res.render("landing");
});


//====================
//AUTHORIZATION ROUTES
//====================

//new User
router.get("/register",(req,res)=>{
	res.render("register");
});//app,get(register)

//create User
router.post("/register",(req,res)=>{
	let newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			req.flash("error", err.message); 
			res.redirect("register");
		} else{
			passport.authenticate("local")(req,res,()=>{
				req.flash("success","Welcome to YelpCamp "+user.username);
				res.redirect("/campgrounds");
			});//passport.authenticate()
		}//else successfully created new user
	});//User.register()
});//app.post(register)

//login get - login form
router.get("/login",(req,res)=>{
	res.render("login");
});//app.get(login)

//login
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	successFlash: "Welcome!",
	failureRedirect: "/login",
	failureFlash: true
	})//passport.authenticate()
);//router.post() for Login



//logout
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});


//default route
router.get("*",(req,res)=>{
	res.redirect("/");
});


module.exports = router;