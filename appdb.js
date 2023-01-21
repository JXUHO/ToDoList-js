const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// ejs파일 사용
app.set("view engine", "ejs");

// form태그 해석, public폴더에 있는 static파일들을 가져옴
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose strict옵션 false로 해제, mongoose로 db와 연결
mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
mongoose.connect("mongodb+srv://jxuholee:gIJM6fkdyFUZWDuN@cluster0.6bcgsry.mongodb.net/todolistDB")

const itemsSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const exampleItem1 = new Item({
  name: "this is an exampleItem1",
});
const exampleItem2 = new Item({
  name: "this is an exampleItem2",
});
const exampleItem3 = new Item({
  name: "this is an exampleItem3",
});

const defaultItems = [exampleItem1, exampleItem2, exampleItem3];

const listSchema = {
  name: String, 
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




///// root route /////
app.get("/", function(req, res) {
  ///// Items collection의 내용 전부를 foundItems라는 이름으로 가져옴 /////
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        } else {
          console.log("sucessfully saved defaultItems into DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("listdb", { listTitle: "Today", addToDo: foundItems });
    }  
  });
  
});




///// root route post request/////
app.post("/", function (req, res) {
  const itemName = req.body.toDo;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundItem){
      foundItem.items.push(item);
      foundItem.save();
      res.redirect(`/${listName}`);
    });
  }
});



app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, function(){});
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, results) {
        res.redirect(`/${listName}`);    
      }
    );
  }
});




app.get("/:route", function(req, res) {
  const route = _.capitalize(req.params.route);
  
  List.findOne({name: route}, function(err, foundList) {
    if (!foundList) {
      console.log("doesn't exist");
      const list = new List({
        name: route,
        items: defaultItems
      });
      list.save(function(){
        res.redirect(`/${route}`);
      });

    } else {
      console.log("exist");
      res.render("listdb", { listTitle: route, addToDo: foundList.items });
    }
  }); 

});



/// work route의 form태그에서 전달된 post request를 받음 ///
app.post("/work", function (req, res) {
  let item = req.body.toDo;
  workItems.push(item);
  res.redirect("/work");
});

///// about route /////
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is on");
});
