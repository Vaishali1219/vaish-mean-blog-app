const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

//xy41sJMWHSXmJFLY

//mongo "mongodb+srv://cluster0.nip26.mongodb.net/blog" --username vaishali

//mongodb+srv://vaishali:xy41sJMWHSXmJFLY@cluster0.nip26.mongodb.net/blog

//mongodb+srv://vaishali:<password>@cluster0.nip26.mongodb.net/<dbname>?retryWrites=true&w=majority

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, "backend/images")));

const db = "mongodb+srv://vaishali:" + process.env.MONGO_ATLAS_PW + "@cluster0.nip26.mongodb.net/blog?retryWrites=true&w=majority";

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected Successfully!');
  }
});

//app.use((req, res, next) => {
//  res.setHeader("Access-Control-Allow-Origin", "*");
//  res.setHeader(
//    "Access-Control-Allow-Headers",
//    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//  );
//  res.setHeader(
//    "Access-Control-Allow-Methods",
//    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//  );
//  next();
//});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
