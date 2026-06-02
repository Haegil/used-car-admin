# 중고차 관리 서비스

Node.js, Express, React를 학습하기 위해 만든 중고차 관리 웹 애플리케이션입니다. 차량 정보를 등록, 조회, 수정, 삭제할 수 있고 제조사와 가격 조건으로 목록을 검색할 수 있습니다.

현재 데이터는 DB가 아니라 서버 메모리에서 관리하며, 초기 데이터는 `data/data.json`에서 불러옵니다.

## 주요 기능

- 차량 목록 조회
- 차량 상세 모달 조회
- 차량 등록, 수정 모달
- 차량 삭제 확인 모달
- 제조사 검색
- 최소 가격, 최대 가격 필터
- 페이지당 10개, 30개, 50개 목록 페이징
- 가격, 연식 숫자 입력 검증
- React 빌드 파일을 Express static으로 제공

## 사용 기술

- Frontend: Vite, React, Tailwind CSS
- Backend: Node.js, Express
- Data: 서버 메모리, `data/data.json`
- Deploy: Render

## 실행 화면

![차량 목록 화면](assets/screenshots/car-list.svg)

## ERD

현재는 실제 DB를 사용하지 않지만, 차량 데이터 구조는 아래 `cars` 엔티티를 기준으로 설계했습니다.

![cars ERD](assets/erd/car-erd.svg)

## 설치 및 실행

루트에서 백엔드 서버를 실행합니다.

```bash
npm install
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다. `frontend/dist`가 있으면 Express가 React 화면을 static으로 제공합니다.

프론트엔드만 개발 서버로 실행하려면 아래 명령을 사용합니다.

```bash
cd frontend
npm install
npm run dev
```

Render 배포와 같은 방식으로 프론트엔드를 빌드한 뒤 Express 서버에서 제공하려면 아래 명령을 사용합니다.

```bash
npm run build
npm start
```

## Render 배포 설정

Render Web Service 생성 후 아래처럼 설정합니다.

```text
Build Command: npm install && npm run build
Start Command: npm start
```

서버 포트는 Render가 제공하는 `PORT` 환경변수를 사용합니다.

```js
const port = process.env.PORT || 3000;
```

## 폴더 구조

```text
codex-lab
├── README.md
├── server.js
├── package.json
├── package-lock.json
├── data
│   └── data.json
├── assets
│   ├── erd
│   │   └── car-erd.svg
│   └── screenshots
│       └── car-list.svg
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
└── prompt
    ├── API_spec.md
    ├── additional_prompt.md
    ├── init_prompt.md
    └── troubleShooting.md
```

## API 요약

| 기능 | Method | URL |
|---|---|---|
| 상태 확인 | GET | `/api/health` |
| 차량 목록 조회 | GET | `/api/cars` |
| 차량 상세 조회 | GET | `/api/cars/:id` |
| 차량 등록 | POST | `/api/cars` |
| 차량 수정 | PUT | `/api/cars/:id` |
| 차량 삭제 | DELETE | `/api/cars/:id` |
| 제조사 검색 | GET | `/api/cars/search?company=HYUNDAI` |
| 가격 필터 | GET | `/api/cars/filter?minPrice=2000&maxPrice=3000` |

차량 목록을 조회합니다.

```bash
curl http://localhost:3000/api/cars
```

가격 범위로 차량을 필터링합니다.

```bash
curl "http://localhost:3000/api/cars/filter?minPrice=2000&maxPrice=3000"
```

차량을 등록합니다.

```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"name":"IONIQ 5","price":4300,"company":"HYUNDAI","year":2024}'
```

차량 정보를 수정합니다.

```bash
curl -X PUT http://localhost:3000/api/cars/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Avante","price":2100,"company":"HYUNDAI","year":2023}'
```

차량을 삭제합니다.

```bash
curl -X DELETE http://localhost:3000/api/cars/1
```

자세한 API 명세는 [prompt/API_spec.md](prompt/API_spec.md)를 참고합니다.

## 문제 해결 기록

개발 중 발생한 문제와 해결 과정은 [prompt/troubleShooting.md](prompt/troubleShooting.md)에 정리했습니다.

## 개선 예정 사항

- 로그인 기능 추가
- 실제 DB 연동
- 테스트 코드 추가
