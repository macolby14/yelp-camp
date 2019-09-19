const mongoose = require("mongoose");
const Campground = require("./models/campground");
let Comment = require("./models/comment"); //currently does note exist


let data = [
	{name: "Cloud's Rest",
	image: "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=335&q=80",
	description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores culpa quo rerum. Id doloribus, itaque voluptates voluptatibus hic dolore distinctio doloremque voluptatum quia fugit qui. Soluta voluptates consequuntur quisquam natus?"},
	{name: "Stary Rock",
	image: "https://images.unsplash.com/photo-1474984815137-e129646c7c9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores culpa quo rerum. Id doloribus, itaque voluptates voluptatibus hic dolore distinctio doloremque voluptatum quia fugit qui. Soluta voluptates consequuntur quisquam natus?"},
	{name: "Desert Sands",
	image: "https://images.unsplash.com/photo-1504964148034-86ded740d1e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores culpa quo rerum. Id doloribus, itaque voluptates voluptatibus hic dolore distinctio doloremque voluptatum quia fugit qui. Soluta voluptates consequuntur quisquam natus?"}
];

function seedDB(){
	Campground.deleteMany({},(err)=>{
	if(err){console.log(err)};
	console.log("DB deleted");
		data.forEach((seed)=>{
			Campground.create(seed,(err,campground)=>{
				if(err){console.log(err);}
				else{/*console.log("Added a campground");*/}
				Comment.create(
					{text: "This place is great, but no internet",
					author: "Homer"}, 
				(err, comment)=>{
					if(err){console.log(err);}
					else{
						campground.comments.push(comment);
						campground.save();
						//console.log("Added a comment from Homer");
					}
				});//end of Comment.create()
			});//end of Campground.create()
		});	//end of data.forEach()
		console.log("Completed Seeding DB");
	});//end of Campground.deleteMany()	
}//end of function seedDB()

module.exports = seedDB;
