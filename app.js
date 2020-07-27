var express = require("express");
var ejs = require("ejs");
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

//connecting mongodb
mongoose.connect("mongodb://localhost:27017/blog_app",{useUnifiedTopology: true , useNewUrlParser: true});

//creating Schema
var blogSchema = new mongoose.Schema({
	title : String,
	image : String,
	body  : String,
	created : {type :Date, default:Date.now},
});
// creating Model
var blogModel = mongoose.model("blogModel",blogSchema);

//creating RESTFUL ROUTES!!!!!!
app.get("/", function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
      blogModel.find({}, function(err,blogData){
           if(err){
                 console.log("MONGODB DIDN'T CONNECT");
           } 
           else{
                res.render("index",{blogs : blogData}); 
                 }              
      });
});

//form for blog
app.get("/blogs/new", function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
   blogModel.create(req.body.blogs,function(err,redir){
           if (err) {
           	res.render("new");
           }
           else{
           	res.redirect("/blogs");
           }
   });
});

app.get("/blogs/:id", function(req,res){
	blogModel.findById(req.params.id,function(err,foundBlog){
		if (err) {

			res.redirect("/blogs");
		}
		else{
             res.render("show",{blogList:foundBlog});
	 	}
	});
	
});
//edit form
app.get("/blogs/:id/edit", function(req,res){
blogModel.findById(req.params.id,function(err,foundBlog){
		if (err) {

			res.redirect("/blogs");
		}
		else{
             res.render("edit",{blogs :foundBlog});
	 	}
	});
});
//update
app.put("/blogs/:id", function(req,res){
       blogModel.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updateBlog){
       	if (err) {
       		res.redirect("/blogs")
       	}else{
       		res.redirect("/blogs/"+req.params.id);
       	}
       });
});
app.delete("/blogs/:id", function(req,res){

     blogModel.findByIdAndDelete(req.params.id,req.body.blogs,function(err,updateBlog){
       	if (err) {
       		res.redirect("/blogs")
       	}else{
       		res.redirect("/blogs/");
       	}
       });
});
app.listen(3000,function(){
    
    console.log("BLOG SERVER 3000");
});