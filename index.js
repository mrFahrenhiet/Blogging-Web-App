//Require Packages
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const port = 3000;
mongoose.connect("mongodb://localhost/blog_site");
var blogSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	Created: {type: Date , default: Date.now}
});
//Declaring use and model
var Blog = mongoose.model("Blog" , blogSchema);
app.use(express.static("public"));
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended: true}));

//index page
app.get("/",function(req,res){
        res.redirect("/blog")

});
app.get("/blog",function(req,res){
	Blog.find({},function(err,data){
		if(err){
			console.log(err);
		}
		else{
			res.render("blog.ejs",{data:data});
		}
	})
	

});
//Create
app.get("/blog/new",function(req,res){
	res.render("form.ejs");
});
app.post("/blog",function(req,res){
	var n = req.body.name;
	var i = req.body.img;
	var d = req.body.des;
	var o = {name: n , image: i , description: d};
	Blog.create(o,function(err,newblog){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blog");
        }
    });
});
//Show
app.get("/blog/yid/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			console.log(err);
		}
		else
		{   res.render("show.ejs",{blog:blog});
			
		}
	})

})
//Edit
app.get("/blog/yid/:id/edit", function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("edit.ejs",{blog:blog});
		}
	})

});
//Update
app.put("/blog/yid/:id",function(req,res){
    var n = req.body.name;
	var i = req.body.img;
	var d = req.body.des;
	var o = {name: n , image: i , description: d};
	Blog.findByIdAndUpdate(req.params.id,o,function(err,ublog){
		if(err){
			console.log(err);
			res.redirect("/blog");
		}
		else
		{
			res.redirect("/blog/yid/" + req.params.id);
		}
	})
});
//Delete
app.delete("/blog/yid/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect("/blog")
		}
	})
})

app.listen(port, function(){
	console.log("The server is running at port: 3000");
});
