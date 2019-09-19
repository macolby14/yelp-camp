const Campground = require("../models/campground");
const Comment = require("../models/comment");
let middlewareObj = {};


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error","You need to be logged in to do that!");
		res.redirect("/login");
	}
}//isLoggedIn

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){req.flash("error","Campground not found");res.redirect("back");}
		else{
			//does the user own the campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}//correct user for campground
			else{
				res.redirect("back");
			}
		}
	});//Campground.findById
	}//if Authenticated
	else{
		req.flash("error","You cannot edit or delete a campground you did not create");
		res.redirect("back");
	}//else not logged in
}//checkCampgroundOwnership

middlewareObj.checkCommentOwnership = function(req,res,next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){req.flash("error","Comment not found");res.redirect("back");}
		else{
			//does the user own the campground
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}//correct user for campground
			else{
				req.flash("error","You cannot edit or delete a comment you did not create");
				res.redirect("back");
			}
		}
	});//Comment.findById
	}//if Authenticated
	else{
		//redirect back if user not logged in
		res.redirect("back");
	}//else not logged in
}//checkCommentOwnership

module.exports= middlewareObj;