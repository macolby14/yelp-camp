const express = require("express");
const router=express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//RESTFUL ROUTES
//INDEX 	/campgrounds 			GET		list of campgrounds
//NEW 		/campgrounds/new 		GET 	form to make new
//CREATE	/campgrounds			POST	Add new to DB
//SHOW		/campgrounds/:id		GET		Shows info about one

//COMMENTS - need to be associated to campground. Need nested routes
//NEW		/campgrounds/:id/comments/new	GET
//CREATE	/campgrounds/:id/comments		POST

//INDEX route page which lists campgrounds names and pictures
router.get("/",(req,res) =>{
	//Get all campgrounds from DB'
	Campground.find({},(err,allCampgrounds) =>{
		if(err){console.log(err);}
		else{res.render("campgrounds/index",{campgrounds:allCampgrounds});}
	});
});

//CREATE route push route used by form to add new campground to array
router.post("/", middleware.isLoggedIn, (req,res)=>{
	//get data from form and add to campgrounds array
	let name=req.body.name;
	let price=req.body.price;
	let img=req.body.image;
	let desc=req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	
	//create a newCampground and save to db
	var newCampground = {name:name,price:price, image:img, description: desc, author:author};
	//console.log("Logged in user is: "+req.user)
	Campground.create(newCampground,(err,newlyCreatedCamp) =>{
		if(err){console.log("err");}
		else{
			//redirect back to campgrounds page
			req.flash("success","Successfully added new campground!");
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE route for new campground form
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new");
});

//SHOW route... needs to be after new because new would be treated as an ID
router.get("/:id",(req,res)=>{
	//find the campground
	Campground.findById(req.params.id).populate("comments").exec((err,foundCamp) =>{
		if(err){console.log(err);}
		else{
			//render show ejs template
			res.render("campgrounds/show",{campground:foundCamp});
		}//else
	});//Campground.findById().populate.exec()
});//app.get() SHOW Route

//EDIT CAMPGROUND ROUTE /campgrounds/:id/edit (GET)
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){console.log("error in edit route"); res.redirect("back");}
		else{
			res.render("campgrounds/edit",{campground: foundCampground});
		}//else no error
	});//findById()
});//EDIT ROUTE

//UPDATE CAMPGROUND ROUTE /campgrounds/:id (PUT)
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){console.log(err); res.redirect("/campgrounds");}
		else{
			req.flash("success","Successfully edited campground");
			res.redirect("/campgrounds/"+req.params.id);
		}
	}); //findAndUpdate
	//redirect to show page
});


//DESTROY route
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){console.log("error in delete"); res.redirect("/campgrounds");}
		else{
			req.flash("success","Campground successfully deleted");
			res.redirect("/campgrounds");}
	});
});//router.delete


module.exports = router;