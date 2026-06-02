[ 차량 목록 조회 ]
- 요청: GET /api/cars
- 설명: 전체 차량 목록을 조회한다. company, minPrice, maxPrice query를 함께 보내면 조건에 맞는 차량만 반환한다.
- 응답: json

```json
[
  {
    "_id": 1,
    "name": "Sonata",
    "price": 2500,
    "company": "HYUNDAI",
    "year": 2023,
    "created_at": "2026-01-01T09:00:00.000Z"
  }
]
```

---

[ 차량 상세 조회 ]
- 요청: GET /api/cars/:id
- 응답: json

```json
{
  "_id": 1,
  "name": "Sonata",
  "price": 2500,
  "company": "HYUNDAI",
  "year": 2023,
  "created_at": "2026-01-01T09:00:00.000Z"
}
```

---

[ 차량 등록 ]
- 요청: POST /api/cars
- 요청 body: json

```json
{
  "name": "Sonata",
  "price": 2500,
  "company": "HYUNDAI",
  "year": 2023
}
```

- 응답: json

```json
{
  "_id": 61,
  "name": "Sonata",
  "price": 2500,
  "company": "HYUNDAI",
  "year": 2023,
  "created_at": "2026-06-02T00:00:00.000Z"
}
```

---

[ 차량 수정 ]
- 요청: PUT /api/cars/:id
- 요청 body: json

```json
{
  "name": "New Sonata",
  "price": 2800,
  "company": "HYUNDAI",
  "year": 2024
}
```

- 응답: json

```json
{
  "_id": 1,
  "name": "New Sonata",
  "price": 2800,
  "company": "HYUNDAI",
  "year": 2024,
  "created_at": "2026-01-01T09:00:00.000Z"
}
```

---

[ 차량 삭제 ]
- 요청: DELETE /api/cars/:id
- 응답: json

```json
{
  "_id": 1,
  "name": "Sonata",
  "price": 2500,
  "company": "HYUNDAI",
  "year": 2023,
  "created_at": "2026-01-01T09:00:00.000Z"
}
```

---

[ 제조사 검색 ]
- 요청: GET /api/cars/search?company=HYUNDAI
- 응답: json

```json
[
  {
    "_id": 1,
    "name": "Sonata",
    "price": 2500,
    "company": "HYUNDAI",
    "year": 2023,
    "created_at": "2026-01-01T09:00:00.000Z"
  }
]
```

---

[ 가격 필터 ]
- 요청: GET /api/cars/filter?minPrice=2000&maxPrice=3000
- 응답: json

```json
[
  {
    "_id": 1,
    "name": "Sonata",
    "price": 2500,
    "company": "HYUNDAI",
    "year": 2023,
    "created_at": "2026-01-01T09:00:00.000Z"
  }
]
```
