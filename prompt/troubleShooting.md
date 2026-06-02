#### 문제
React에서 Express API를 호출할 때 CORS 오류가 발생한다.

#### 원인
프론트엔드와 백엔드의 포트가 달라 브라우저에서 요청을 차단했다.

#### 해결
Express 서버에 cors 미드웨어를 추가했다.

```js
const cors = require('cors');
app.use(cors());
```

---

#### 문제
Render 배포 후 React 화면을 새로고침하면 404가 발생할 수 있다.

#### 원인
Express 서버가 정적 파일만 제공하고 React 라우팅 경로를 처리하지 않으면, 새로고침 요청을 API가 아닌 서버 경로로 해석한다.

#### 해결
프론트엔드 빌드 결과를 static으로 제공하고, 나머지 요청은 `index.html`로 응답하도록 처리했다.

```js
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});
```

---

#### 문제
GET /api/cars/search 요청이 GET /api/cars/:id로 처리될 수 있다.

#### 원인
Express 라우트는 위에서 아래로 매칭되므로 동적 라우트가 먼저 선언되면 `search`를 id 값으로 해석한다.

#### 해결
`/api/cars/search`, `/api/cars/filter` 라우트를 `/api/cars/:id`보다 먼저 선언했다.

```js
app.get('/api/cars/search', (req, res) => {
  res.json(filterCars({ company: req.query.company }));
});

app.get('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id);
});
```

---

#### 문제
데스크톱과 모바일 화면에서 검색 input과 버튼 영역이 겹치거나 좌우 스크롤이 생겼다.

#### 원인
검색 폼과 목록 테이블의 가로 폭이 고정된 형태에 가까웠고, input 요소에 `min-width` 제어가 부족했다. 모바일 화면에서는 테이블 컬럼을 그대로 유지하려고 하면서 화면 폭을 넘어갔다.

#### 해결
검색 폼은 화면 크기에 따라 컬럼 수가 바뀌도록 grid를 조정하고, input에는 `w-full`, `min-w-0`을 적용했다. 차량 목록은 데스크톱에서는 테이블처럼 보이고, 작은 화면에서는 카드처럼 세로 배치되도록 수정했다.

```jsx
<form className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_160px_160px_auto_auto]">
  <input className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm" />
</form>
```

---

#### 문제
차량 상세 정보가 목록 옆에 표시되어 화면이 복잡해졌다.

#### 원인
목록과 상세 영역이 같은 화면 안에서 동시에 공간을 차지했다. 특히 모바일에서는 상세 영역이 목록과 함께 표시되면서 화면이 길고 복잡해졌다.

#### 해결
차량 목록의 정보 영역을 클릭하면 상세 정보를 모달로 보여주도록 변경했다. 수정, 삭제 버튼은 별도 이벤트를 유지하고, 차량 정보 영역만 상세 모달을 열도록 분리했다.

```jsx
<CarTable
  cars={pagedCars}
  onSelect={handleSelect}
  onEdit={handleEdit}
  onDelete={setDeleteTarget}
/>

{detailCar && (
  <Modal title="차량 상세" onClose={() => setDetailCar(null)}>
    {/* 차량 상세 정보 */}
  </Modal>
)}
```

---

#### 문제
차량 목록이 한 번에 모두 보여서 데이터가 많을 때 화면이 길어졌다.

#### 원인
서버에서 받은 전체 차량 배열을 그대로 렌더링했다.

#### 해결
`pageSize`, `currentPage` 상태를 추가하고, 현재 페이지에 해당하는 데이터만 잘라서 보여주도록 처리했다. 사용자가 페이지당 10개, 30개, 50개를 선택할 수 있도록 `select`를 추가했다.

```jsx
const totalPages = Math.max(1, Math.ceil(cars.length / pageSize));
const safeCurrentPage = Math.min(currentPage, totalPages);
const startIndex = (safeCurrentPage - 1) * pageSize;
const pagedCars = cars.slice(startIndex, startIndex + pageSize);
```

---

#### 문제
수정, 삭제 버튼의 텍스트가 좁은 영역에서 줄바꿈되어 어색하게 보였다.

#### 원인
버튼 폭이 충분하지 않고, 버튼 안의 텍스트 줄바꿈을 막는 스타일이 없었다.

#### 해결
버튼에 `whitespace-nowrap`, `min-w`를 적용해 텍스트가 한 줄로 유지되도록 수정했다.

```jsx
<button className="inline-flex h-9 min-w-[68px] items-center justify-center gap-1 whitespace-nowrap">
  수정
</button>
```

---

#### 문제
차량 등록과 수정 폼이 목록 화면에 같이 노출되어 목록이 복잡해졌다.

#### 원인
등록, 수정 입력 폼이 목록과 같은 화면 영역을 사용했다.

#### 해결
등록 버튼을 상단 Navbar 영역으로 이동하고, 등록과 수정 폼을 모달로 열도록 변경했다. 삭제도 바로 실행하지 않고 확인 모달을 거치도록 처리했다.

```jsx
{isFormOpen && (
  <Modal title={editingId ? '차량 수정' : '차량 등록'} onClose={closeForm}>
    <CarForm
      form={form}
      editingId={editingId}
      onChange={handleFormChange}
      onSubmit={handleSubmit}
      onCancel={closeForm}
    />
  </Modal>
)}
```

---

#### 문제
가격과 연식 input에 `min` 속성을 넣었지만 음수가 입력될 수 있었다.

#### 원인
HTML `number` input은 `min`보다 작은 값의 입력 자체를 항상 막지는 않는다. 브라우저에 따라 `-`, `e` 같은 문자가 입력될 수 있고, `min`은 주로 폼 유효성 검사 단계에서 동작한다.

#### 해결
가격과 연식 input을 `type="text"`와 `inputMode="numeric"` 조합으로 바꾸고, `onChange`에서 정규표현식으로 숫자만 통과시켰다. 검색 가격 input과 등록, 수정 input 모두 같은 규칙을 적용했다.

```jsx
const numberPattern = /^\d*$/;

function handleFormChange(event) {
  const { name, value } = event.target;

  if (['price', 'year'].includes(name) && !numberPattern.test(value)) {
    return;
  }

  setForm((current) => ({ ...current, [name]: value }));
}
```

```jsx
<input
  name="price"
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={form.price}
  onChange={onChange}
/>
```

---

#### 문제
프론트에서 음수 입력을 막아도 API에 직접 요청하면 음수 연식이 저장될 수 있었다.

#### 원인
서버 검증은 가격이 0 이상인지 확인했지만, 연식이 0 이상인지 확인하지 않았다.

#### 해결
`validateCar` 함수에 연식 음수 검증을 추가했다.

```js
if (year < 0) {
  return '연식은 0 이상이어야 합니다.';
}
```

---

#### 문제
상단 Navbar의 로고를 클릭했을 때 초기 화면으로 돌아가는 동작이 없었다.

#### 원인
로고 영역이 단순 텍스트로만 구성되어 있었고, 필터, 모달, 페이지 상태를 한 번에 초기화하는 핸들러가 없었다.

#### 해결
로고 영역을 `button`으로 변경하고, 클릭 시 검색 조건, 모달, 메시지, 폼, 페이지 크기를 초기값으로 되돌린 뒤 전체 차량 목록을 다시 불러오도록 처리했다.

```jsx
async function handleLogoClick() {
  const nextFilters = { company: '', minPrice: '', maxPrice: '' };

  setDetailCar(null);
  setDeleteTarget(null);
  setEditingId(null);
  setForm(emptyForm);
  setFilters(nextFilters);
  setMessage('');
  setIsFormOpen(false);
  setPageSize(10);
  await loadCars(nextFilters);
}
```

---

#### 문제
`localhost:3000` 접속 시 React 화면이 아니라 기존 학습용 응답인 `Hello Codex`가 표시되었다.

#### 원인
Express 라우트는 위에서 아래로 먼저 매칭된 라우트가 응답한다. `app.get('/')`가 `express.static()`보다 먼저 선언되어 있어서, React 빌드 결과인 `frontend/dist/index.html`이 응답되기 전에 `Hello Codex`가 먼저 반환되었다.

#### 해결
`frontend/dist` static 서빙을 먼저 등록하고, `/` 경로는 React `index.html`을 반환하도록 수정했다. 기존 학습용 `/cars` API는 유지하고, React 라우팅 새로고침을 위해 마지막 fallback도 유지했다.

```js
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});
```

---
