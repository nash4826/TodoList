
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// mongodb 연결(Cluster)
// 비밀번호는 생략함
mongoose.connect("mongodb+srv://admin-gys:<password>@cluster0.5msgo.mongodb.net/todolistDB",{ useNewUrlParser: true });


// create Schema

const workItemsSchema = {
  content: {
    type: String,
    required: true
  }
};

// create collections(Table)
const WorkItem = mongoose.model('Item', workItemsSchema);

// init Content

const initItem1 = new WorkItem({
  content: "안녕하세요? 투두리스트에요"
});

const initItem2 = new WorkItem({
  content: "+ 버튼을 클릭해서 할 일을 기록하세요"
});
const initItem3 = new WorkItem({
  content: "<-- 일을 마무리 했다면, 체크하세요"
});

const defaultItems = [initItem1, initItem2, initItem3];



app.get('/', function (req, res) {
  WorkItem.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      WorkItem.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("SuccessFully saved defaultItems")
        }
      });
      res.redirect('/');
    } else {
      res.render('todolist', { Title:"To Do List", listItems: foundItems});
    }
  });
});


// Create

app.post('/', function (req, res) {
  const listName = req.body.list;
  const post = new WorkItem({
    content: req.body.newItem
  });
  if (listName === "To Do List") {
    post.save();
    res.redirect('/');  
  }
});

// Delete

app.post('/delete', function (req, res) {
  const checkedItemId = req.body.checkbox;
  WorkItem.findByIdAndRemove(checkedItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully delete Item");
      res.redirect('/');
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server Started on port 3000");
})