require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({
  extended: true
}));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true
});

const homeStartingContent = " Journaling is a habit. It’s not a hobby for when you’re feeling great or have the luxury of time.It’s a habit you develop that you actually need most when you’re feeling anxious, hurried or just not in the mood. And you don’t have to beat ourselves up whenever you fall short of writing daily.Journaling can also be a check-in tool. There are seasons in your life when you feel balanced and motivated – and you’ve got your priorities straight.And other times you’re stressed and wonder what it’s all for.But the value of journaling comes through when you stick with it despite the ups and downs.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {

  Post.find({}, (err, posts) => {

    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");

});

app.post("/compose", (req, res) => {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save((err)=>{
    if(!err){

      res.redirect("/")
    }
  });


});

app.get("/posts/:postName", (req, res) => {
  // console.log(req.params.postName);
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({},(err,posts)=>{

    posts.forEach(post => {
      const storedTitle = _.lowerCase(post.title);
      if (storedTitle == requestedTitle) {
        res.render("post.ejs", {
          postTitle: (post.title),
          postBody: (post.content)
        });
      }
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started");
});