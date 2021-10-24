const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const path = require("path");

var db, collection;

const url =
  "mongodb+srv://appdata:appdata@cluster0.ubxqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "demo";

app.listen(3000, () => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      db = client.db(dbName);
      console.log("Connected to `" + dbName + "`!");
    }
  );
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  db.collection("messages")
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render("index.ejs", { messages: result });
    });
});
app.post("/messages", (req, res) => {
  let isPalindrome =
    req.body.name === req.body.name.split("").reverse().join("") ? true : false;
  console.log(isPalindrome);
  db.collection("messages").insertOne(
    {
      name: req.body.name,
      palindrome: isPalindrome,
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to database");
      res.redirect("/");
    }
  );
});
app.delete("/messages", (req, res) => {
  console.log(req.body.name);
  db.collection("messages").findOneAndDelete(
    { name: req.body.name },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("Message deleted!");
    }
  );
});
