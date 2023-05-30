const express = require("express");
const app = express();  //app is the instance of the function express
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require("lodash");

//Connect to MongoDB
const DBURI ="mongodb+srv://Braga_the_boss:RNp76c7cgcRXgda8@cluster0.thd1ml7.mongodb.net/Node-practice?retryWrites=true&w=majority";

mongoose.connect(DBURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result) =>app.listen(3000,()=>console.log("Listening on port 3000")))
.catch((err)=>console.log(err));

app.set("view engine","ejs");

app.use(express.static('public'));
app.use(express.urlencoded({extended:true})); // it is middleware that comes with express which takes all the urlencoded data and pass that into the req object

//Mongoose and mongo sandbox routes
// app.get('/add-blog',(req,res)=>
//     {
//         const blog = new Blog({
//             title:"New Blog",
//             snippet:"About my new blog",
//             body:"Content of my new blog"
//         });
//         blog.save()
//         .then((result) =>{
//             res.send(result);
//         })
//         .catch((err)=>{
//             console.log(err);
//         })
//     }
// )


app.get("/", (req,res)=>{
    // res.sendFile("./views/index.html",{root:__dirname})
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render("index.ejs",{title:"All Blogs",blogs:result})
    })
    .catch((err)=>
    console.log(err))
    // res.render("index.ejs",{title:"All Blogs"});

});

app.post("/blogs",(req,res)=>{
    const blog = new Blog(req.body );
    blog.save()
    .then((result)=>{
        res.redirect("/");
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get("/blogs/create",(req,res)=>{
    res.render("create.ejs",{title:"Create Blog"})
});

app.get("/blogs/:id",(req,res)=>{
    const id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)){
    Blog.findById(id)
    .then((result)=>{
        res.render("single-blog.ejs",{blog:result,title:"Blog Details"});
    })
    .catch((err)=>{
        console.log(err);
    })
}
});

app.delete("/blogs/:id",(req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:'/'})
    })//Here we are sending an AJAX request (sending request from the javascript),In Node we cant use render as a response we have to send Json or text data as a response to the browser
    .catch((err)=>console.log(err))
})

app.get("/about", (req,res)=>{
    // res.sendFile("./views/about.html",{root:__dirname})
    res.render("about.ejs",{title:"About Us"})
});

app.get("/about-us", (req,res)=>{
    res.redirect("/about");
});




app.use((req,res)=>{
    res.status(404).render("404.ejs",{title:"Page Not found"})
});

