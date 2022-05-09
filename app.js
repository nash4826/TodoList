
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-Parser');
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// mongodb 연결(로컬호스트로 연결 추후 클라우드로 연결)
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true });


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

// 오늘은 여기까지 post작성

app.post('/', function (req, res) {
  console.log(req.body.newItem);
  res.redirect('/');
});


app.listen(3000, function () {
  console.log("Server Started on port 3000");
})