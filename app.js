// Declare variables.
var express         = require("express"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    app             = express();

// App config.
const PORT = process.env.PORT || 5000                           // Set the port for the server to listen on.
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Mongoose database config.
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/* Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1487341290491-1081724e5844?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=aa97c08ab6ce7d79279c8da5c382aa3d&auto=format&fit=crop&w=750&q=80",
    body: "Hello. This is a blog post."
}); */

// Routes.
// Index route.
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error.");
        } else {
            res.render("index.ejs", {blogs:blogs});
        }
    });
});

// New route.
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

// Create route.
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new.ejs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show route.
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", {blog: foundBlog});
        }
    });
});

// Edit route.
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", { blog: foundBlog });
        }
    });
});

// Update route.
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete route.
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Starts the server to start listening at the port specified.
app.listen(PORT, function () {
    console.log("The server has started!");
    console.log("The server is listening on " + PORT);
});