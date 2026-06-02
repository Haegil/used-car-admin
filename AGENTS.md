# AGENTS.md

## 프로젝트 목적

이 프로젝트는 Node.js와 Express를 학습하기 위한 실습 프로젝트이다.

## 코드 작성 규칙

- 초보자가 이해할 수 있도록 단순하게 작성한다.
- 핵심 코드에는 짧은 한글 주석을 추가한다.
- 불필요하게 복잡한 구조로 분리하지 않는다.

## 실행 방법

```bash
npm install
npm start
```

# Repository Guidelines

## Project Structure & Module Organization

This is a small CommonJS Node.js/Express project. The API entry point is `server.js`, which defines the Express app, in-memory `cars` data, and routes for `/`, `/cars`, and `/cars/:id`. Project metadata and npm scripts live in `package.json`; dependency versions are locked in `package-lock.json`. There is currently no separate `src/`, `tests/`, or assets directory. If the app grows, prefer moving route handlers into `src/routes/` and shared helpers into `src/lib/`, with tests in `tests/` or colocated as `*.test.js`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run the API with `node server.js` on `http://localhost:3000`.
- `npm test`: currently a placeholder that exits with an error. Replace it when adding a real test runner.

For local API checks, start the server and use commands such as:

```sh
curl http://localhost:3000/cars
curl http://localhost:3000/cars/1
```

## Coding Style & Naming Conventions

Use CommonJS imports (`require`) and standard JavaScript. Follow the existing style: two-space indentation, single quotes, semicolons, and clear route callbacks. Use lower camelCase for variables and functions (`newCar`, `carIndex`) and keep car objects consistent with `_id`, `name`, `price`, `company`, and `year`. Comments may be Korean or English, but keep them short and useful.

## Testing Guidelines

No testing framework is installed yet. When adding tests, prefer a focused Node API setup such as Jest or Node's built-in test runner with Supertest for HTTP routes. Name tests after the behavior being verified, for example `server.test.js` or `cars.routes.test.js`. Cover success and failure cases for each route, especially `404` behavior and mutation routes (`POST`, `PUT`, `DELETE`). Update `npm test` so it runs the full suite.

## Commit & Pull Request Guidelines

This repository has no commit history yet, so use straightforward imperative commit messages such as `Add car route tests` or `Validate car payloads`. Keep each commit focused. Pull requests should include a short description, commands run, API behavior changed, and example requests/responses when routes are added or modified. Link related issues when available.

## Security & Configuration Tips

Do not commit secrets or local environment files; `.gitignore` already excludes `.env*` and `node_modules/`. Validate request bodies before trusting client input, especially for `POST /cars` and `PUT /cars/:id`.
