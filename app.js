const express		=	require("express"),
	  app			=	express(),
	  bodyParser 	= 	require("body-parser"),
	  mongoose		=	require("mongoose"),
	  passport		=	require("passport"),
	  LocalStrategy	=	require("passport-local"),
	  methodOverride = 	require("method-override"),
	  flash			=	require("connect-flash");
	  
//requiring models	  
const User			=	require("./models/user"),
	  Campground 	= 	require("./models/campground"),
	  Comment		=	require("./models/comment"),
	  seedDB 		=	require("./seeds");
	  

//requiring routes
const commentRoutes = 	require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes	=	require("./routes/index");

//configure port for goorm (3000) or heroku (process.env.PORT)
const PORT = process.env.PORT || 3000;


//seedDB(); //seed the database. Commented out for now, manually seeding.
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false); //allows use of Model.findByIdAndUpdate()
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method")); //allows PUT and DELETE
app.use(flash());

//PASPORT config
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);



//start server port 3000
app.listen(PORT,()=>{
	console.log("Server is listening on port "+PORT);
});