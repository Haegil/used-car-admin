const path = require('path');
const express = require('express');
const cors = require('cors');
const initialCars = require('./data/data.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// data.json의 초기 데이터를 서버 메모리에 복사해서 사용합니다.
let cars = initialCars.map((car) => ({ ...car }));

function getNextId() {
  const maxId = cars.reduce((max, car) => Math.max(max, car._id), 0);
  return maxId + 1;
}

function filterCars(query) {
  const company = query.company;
  const minPrice = query.minPrice ? Number(query.minPrice) : null;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : null;

  return cars.filter((car) => {
    if (company && car.company !== company) {
      return false;
    }

    if (minPrice !== null && car.price < minPrice) {
      return false;
    }

    if (maxPrice !== null && car.price > maxPrice) {
      return false;
    }

    return true;
  });
}

function validateCar(body) {
  if (!body.name || !body.company || !body.price || !body.year) {
    return '차량명, 가격, 제조사, 연식은 필수입니다.';
  }

  const price = Number(body.price);
  const year = Number(body.year);

  if (Number.isNaN(price) || Number.isNaN(year)) {
    return '가격과 연식은 숫자로 입력해야 합니다.';
  }

  if (price < 0) {
    return '가격은 0 이상이어야 합니다.';
  }

  if (year < 0) {
    return '연식은 0 이상이어야 합니다.';
  }

  return null;
}

app.get('/api/health', (req, res) => {
  res.json({ message: 'ok' });
});

// 차량 목록을 조회합니다. query가 있으면 제조사와 가격 조건으로 필터링합니다.
app.get('/api/cars', (req, res) => {
  res.json(filterCars(req.query));
});

// 제조사별 차량 검색입니다. company가 없으면 전체 목록을 반환합니다.
app.get('/api/cars/search', (req, res) => {
  res.json(filterCars({ company: req.query.company }));
});

// 가격 범위 검색입니다. minPrice 또는 maxPrice가 없어도 동작합니다.
app.get('/api/cars/filter', (req, res) => {
  res.json(filterCars(req.query));
});

// 차량 상세 정보를 조회합니다.
app.get('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((item) => item._id === id);

  if (!car) {
    return res.status(404).json({ message: '자동차를 찾을 수 없습니다.' });
  }

  res.json(car);
});

// 새 차량을 등록합니다.
app.post('/api/cars', (req, res) => {
  const errorMessage = validateCar(req.body);

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  const newCar = {
    _id: getNextId(),
    name: req.body.name,
    price: Number(req.body.price),
    company: req.body.company,
    year: Number(req.body.year),
    created_at: new Date().toISOString(),
  };

  cars.push(newCar);
  res.status(201).json(newCar);
});

// 차량 정보를 수정합니다.
app.put('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const carIndex = cars.findIndex((item) => item._id === id);

  if (carIndex === -1) {
    return res.status(404).json({ message: '자동차를 찾을 수 없습니다.' });
  }

  const nextCar = { ...cars[carIndex], ...req.body, _id: id };
  const errorMessage = validateCar(nextCar);

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  cars[carIndex] = {
    ...nextCar,
    price: Number(nextCar.price),
    year: Number(nextCar.year),
  };

  res.json(cars[carIndex]);
});

// 차량 정보를 삭제합니다.
app.delete('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const carIndex = cars.findIndex((item) => item._id === id);

  if (carIndex === -1) {
    return res.status(404).json({ message: '자동차를 찾을 수 없습니다.' });
  }

  const deletedCar = cars.splice(carIndex, 1)[0];
  res.json(deletedCar);
});

const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));

// 기존 학습용 URL도 사용할 수 있게 유지합니다.
// '/' 경로는 React index.html이 응답하도록 static 뒤에 둡니다.
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.get('/cars', (req, res) => {
  res.json(filterCars(req.query));
});

app.get('/cars/search', (req, res) => {
  res.json(filterCars({ company: req.query.company }));
});

app.get('/cars/filter', (req, res) => {
  res.json(filterCars(req.query));
});

app.get('/cars/:id', (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((item) => item._id === id);

  if (!car) {
    return res.status(404).json({ message: '자동차를 찾을 수 없습니다.' });
  }

  res.json(car);
});

// Render 배포 시 React 라우팅이 새로고침되어도 index.html을 응답합니다.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, (error) => {
  if (error) {
    console.error('서버를 시작하지 못했습니다:', error.message);
    return;
  }

  console.log(`Server is running on http://localhost:${port}`);
});
