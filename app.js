const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 设置 EJS 为模板引擎，并设置 views 目录
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 将 /images 映射到本地的 images 文件夹
app.use('/images', express.static(path.join(__dirname, 'images')));

// 解析 POST 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 定义 Car 类
class Car {
  constructor({ id, title, description, price, sellerEmail, brand, miles, color }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.sellerEmail = sellerEmail;
    this.brand = brand;
    this.miles = miles;
    this.color = color;
  }
}

// 模拟内存数据库，用于存储车源
let listings = [];

// 首页：支持通过查询参数过滤车源
app.get('/', (req, res) => {
  const { brand, maxMiles, color } = req.query;
  let filteredListings = listings.filter(car => {
    let valid = true;
    if (brand && car.brand.toLowerCase() !== brand.toLowerCase()) {
      valid = false;
    }
    if (maxMiles && car.miles > Number(maxMiles)) {
      valid = false;
    }
    if (color && car.color.toLowerCase() !== color.toLowerCase()) {
      valid = false;
    }
    return valid;
  });
  res.render('index', { listings: filteredListings });
});

// GET /post: 渲染发布车源页面
app.get('/post', (req, res) => {
  res.render('post');
});

// POST /post: 处理发布车源请求
app.post('/post', (req, res) => {
  const newCar = new Car({
    id: listings.length + 1,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    sellerEmail: req.body.sellerEmail,
    brand: req.body.brand,
    miles: req.body.miles,
    color: req.body.color,
  });
  listings.push(newCar);
  res.redirect('/');
});

// GET /listing/:id: 展示单个车源详情
app.get('/listing/:id', (req, res) => {
  const car = listings.find(l => l.id === parseInt(req.params.id));
  if (car) {
    res.render('listing', { listing: car });
  } else {
    res.status(404).send("未找到对应车源");
  }
});

// POST /contact/:id: 处理联系卖家请求
app.post('/contact/:id', (req, res) => {
  // 简单模拟发送联系信息
  res.send("您的信息已发送给卖家！");
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
