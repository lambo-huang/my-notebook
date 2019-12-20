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
  res.render('add', {
    title: "新增"
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

router.get('/getItemInfo', (req, res, next) => {
  const { id } = req.query;
  fs.readFile('./data/db.json', (err, data) => {
    const list = JSON.parse(data.toString());
    const [{ title, content }] = list.filter(item => item.id === id);
    res.json({
      title,
      content
    });
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
      let {id,  title, content, createTime } = req.body;
      if (!id) {
        // 新增
        const param = {
          id: UUID.generate(),
          title,
          content,
          createTime
        };
        list.push(param);
      } else {
        // 编辑
        list.forEach(item => {
          if (item.id === id) {
            item.title = title;
            item.content = content;
          }
        });
      }

      writeDB(res, list);
    }

  });
});

router.get('/deleteInfo', (req, res, next) => {
  let { id } = req.query;

  let ids = JSON.parse(id);

  fs.readFile('./data/db.json', (err, data) => {
    let list = JSON.parse(data.toString());

    list.forEach((item, index) => {
      ids.forEach(that => {
        if (item.id === that) {
          list.splice(index, 1);
        }
      })
    });
    writeDB(res, list);
  })
});




module.exports = router;
