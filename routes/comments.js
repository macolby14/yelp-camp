const express = require("express");
const router=express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err){
			req.flash("error","Something went wrong");
			console.log(err); res.redirect("back");}
		else{
			res.render("comments/new",{campground: foundCamp});}
	});//Campground.findById()
});//NEW ROUTE

//Comments Create
router.post("/",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err){console.log(err);req.flash("error","Something went wrong!"); res.redirect("/campgrounds");}
		else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){req.flash("error","Something went wrong!"); console.log(err);}
				else{
					//add username and id comment, save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//add comment to array of foundCamp corresponding to id
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success","Added new comment");
					res.redirect("/campgrounds/"+foundCamp._id);
				}
			});//Comment.create()
		}
	});//Campground.findById
});//COMMENTS POST route

//Comments EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){console.log("error in comments edit"); res.redirect("back");}
		else{
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
	
});//edit route


//Comments UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComments)=>{
		if(err){console.log("Error in comment update route"); res.redirect("back");}
		else{
			req.flash("success","Updated your comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});//findByIdAndUpdate
});

//Comments DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){console.log("Error in Comments Destroy route");res.redirect("back");}
		else{
			req.flash("success","Deleted your comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});//findByIdAndRemove
});//delete route

module.exports = router;

