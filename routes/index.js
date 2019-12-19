const express = require('express');
const router = express.Router();

const fs = require('fs');
const UUID = require('uuidjs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '主页'
  });
});

router.get('/add', (req, res, next) => {
  const { id } = req.query;

  fs.readFile('./data/db.json', (err, data) => {
    const list = JSON.parse(data.toString());
    const { title, content } = list.map(item => item.id === id);
    res.render('add', {
      id,
      title,
      content
    });
  });

});

router.get('/getList', (req, res, next) => {
  let { key } = req.query;
  fs.readFile('./data/db.json', (err, data) => {
    if (err) {
      return console.error(err);
    } else {
      let list = JSON.parse(data.toString());

      if (key) {
        list = list.filter(item => (item.title.indexOf(key) > -1 || item.content.indexOf(key) > -1));
      }
      res.json({
        "code": 0,
        "message": "",
        "total": list.length,
        "data": list
      })
    }
  });
});

let writeDB = (res, list) => {
  fs.writeFile('./data/db.json', JSON.stringify(list), err => {
    if (err) {
      res.json({
        "code": 1
      });
    } else {
      res.json({
        "code": 0
      });
    }
  })
};

router.post('/addInfo', (req, res, next) => {
  fs.readFile('./data/db.json', (err, data) => {
    if (err) {
      return console.error(err);
    } else {
      let list = JSON.parse(data.toString());
      let { title, content, createTime } = req.body;
      const param = {
        "id": UUID.generate(),
        title,
        content,
        createTime
      };

      list.push(param);
      writeDB(res, list);
    }

  });
});

router.get('/deleteInfo', (req, res, next) => {
  const { id } = req.query;

  fs.readFile('./data/db.json', (err, data) => {
    let list = JSON.parse(data.toString());

    list.forEach((item, index) => {
      if (item.id === id) {
        list.splice(index, 1);
        writeDB(res, list);
      }
    })
  })
});




module.exports = router;
