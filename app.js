const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

const newItems = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));




///// root route /////


app.get("/", function (req, res) {

  let day = date.getDate();

  /// list.ejs에 app.js파일에서 생성한 변수, 리스트를 보냄 ///
  res.render("list", { listTitle: day, addToDo: newItems });
});

/// root route의 form태그에서 전달된 post request를 받음 ///
app.post("/", function (req, res) {
  console.log(req.body);

  let newItem = req.body.toDo;

  if (req.body.list == "Work") {
    workItems.push(newItem);
    res.redirect("/work");
  } else {
    newItems.push(newItem);
    res.redirect("/");
  }

});





///// work route /////


app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", addToDo: workItems });
});

/// work route의 form태그에서 전달된 post request를 받음 ///
app.post("/work", function (req, res) {
  let item = req.body.toDo;
  workItems.push(item);
  res.redirect("/work");
});





///// about route /////

app.get("/about", function(req, res) {
  res.render("about")
})






app.listen(3000, function () {
  console.log("server is on 3000");
});
