var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 生成一个express实例 app
var app = express();

// 设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
// 设置视图模板引擎为 ejs
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/favicon.ico’)); // 设置/public/favicon.ico为favicon图标。

app.use(logger('dev')); // 加载日志中间件
app.use(express.json()); //加载解析json的中间件
app.use(express.urlencoded({ extended: false })); // 加载解析urlencoded请求体的中间件
app.use(cookieParser()); //加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public'))); // 设置public文件夹为存放静态文件的目录

// 路由控制器
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
  next(createError(404));
});

// 开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
