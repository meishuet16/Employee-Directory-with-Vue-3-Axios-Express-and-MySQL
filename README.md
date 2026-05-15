# Employee Directory — Chapter 8 Individual Assignment

**Name:** LEE MEI SHUET
**Matric No:** A24CS0102
**Course:** Web Application Development  
**Stack:** Vue 3 · Vite · Axios · Express · MySQL

---

## Setup Instructions

### Prerequisites
- Laragon (Full edition) with MySQL running on port 3306
- Node.js 18+ and npm 9+

### 1. Database Setup
1. Open HeidiSQL via Laragon
2. File → Load SQL file → select `sql/schema.sql`
3. Press F9 to execute
4. Verify: 7 rows appear in `employee_directory.employees`

### 2. Backend (port 3001)
```bash
cd server
npm install
cd ..
npm run server
```
Expected output: `Employee Directory API running at http://localhost:3001`

### 3. Frontend (port 5174)
```bash
npm install
npm run dev
```
Browser opens automatically at `http://localhost:5174`

---

## Architecture
Browser (5174) ←→ Express API (3001) ←→ MySQL (3306)
Vue 3             Node.js             Laragon

## Notes
- All SQL queries use prepared statements (? placeholders) — no string concatenation
- Single Axios instance with request + response interceptors in src/api/employeeApi.js
- Three components: EmployeeForm, EmployeeList, SearchSort
- Salary displayed using Intl.NumberFormat('ms-MY', { currency: 'MYR' })
- Responsive layout: 2-column form on desktop, 1-column on mobile (<768px)