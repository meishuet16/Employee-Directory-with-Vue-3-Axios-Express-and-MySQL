require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const pool    = require('./db')

const app = express()

app.use(cors())         
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Employee Directory API' })
})

const empIdRegex  = /^EMP[0-9]{3,5}$/
const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations']

function validateEmployee(body) {
  const errors = {}
  const { empId, name, email, department, position, hireDate, salary } = body

  if (!empId || !empIdRegex.test(String(empId).trim().toUpperCase()))
    errors.empId = 'Format: EMP followed by 3-5 digits (e.g. EMP001).'

  if (!name || String(name).trim().length < 3)
    errors.name = 'Name must be at least 3 characters.'

  if (!email || !emailRegex.test(String(email).trim()))
    errors.email = 'Please enter a valid email address.'

  if (!department || !DEPARTMENTS.includes(department))
    errors.department = 'Please select a valid department.'

  if (!position || !String(position).trim())
    errors.position = 'Position is required.'

  if (!hireDate) {
    errors.hireDate = 'Hire date is required.'
  } else if (new Date(hireDate) > new Date()) {
    errors.hireDate = 'Hire date cannot be in the future.'
  }

  const sal = Number(salary)
  if (isNaN(sal) || sal < 1500 || sal > 50000)
    errors.salary = 'Salary must be between RM 1,500 and RM 50,000.'

  return errors //NO ERRORS: empty object; HAS ERRORS: object with error messages
}

// GET /employees                          → get all employees
// GET /employees?q=ahmad                  → search employees by name, empId, email, or department
// GET /employees?sortBy=salary&order=desc → sort employees by salary in descending order
app.get('/employees', async (req, res) => {
  try {
    const { q, sortBy, order } = req.query

    let sql = 'SELECT * FROM employees'
    const params = []
    if (q) {
      sql += ' WHERE name LIKE ? OR empId LIKE ? OR email LIKE ? OR department LIKE ?'
      const like = `%${q}%` // % means "anything before or after"
      params.push(like, like, like, like)
    }

    // only allow sorting by specific columns to prevent SQL injection
    const allowedSort = ['name', 'hireDate', 'salary', 'empId', 'department']
    if (sortBy && allowedSort.includes(sortBy)) {
      const dir = order === 'desc' ? 'DESC' : 'ASC'
      sql += ` ORDER BY ${sortBy} ${dir}`
    }

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// READ single employee
// GET /employees/1 → get employee with id=1
app.get('/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM employees WHERE id = ?', [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Database error' })
  }
})

// add new employee
// POST /employees（body got new employee data）→ add new employee
app.post('/employees', async (req, res) => {
  try {
    // Validate the input data using the validateEmployee function
    const errs = validateEmployee(req.body)
    if (Object.keys(errs).length)
      return res.status(400).json({ errors: errs })

    const { empId, name, email, department, position, hireDate, salary, active } = req.body

    const [r] = await pool.query(
      `INSERT INTO employees
         (empId, name, email, department, position, hireDate, salary, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empId.trim().toUpperCase(),
        name.trim(),
        email.trim(),
        department,
        position.trim(),
        hireDate,
        Number(salary),
        active ? 1 : 0
      ]
    )
    res.status(201).json({ id: r.insertId, ...req.body })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Employee ID already exists.' })
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

//UPDATE
// PUT /employees/1 (body got updated employee data) → update employee with id=1
app.put('/employees/:id', async (req, res) => {
  try {
    const errs = validateEmployee(req.body)
    if (Object.keys(errs).length)
      return res.status(400).json({ errors: errs })

    const { empId, name, email, department, position, hireDate, salary, active } = req.body

    const [r] = await pool.query(
      `UPDATE employees SET
         empId=?, name=?, email=?, department=?,
         position=?, hireDate=?, salary=?, active=?
       WHERE id=?`,
      [
        empId.trim().toUpperCase(),
        name.trim(),
        email.trim(),
        department,
        position.trim(),
        hireDate,
        Number(salary),
        active ? 1 : 0,
        req.params.id
      ]
    )
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' })
    res.json({ id: Number(req.params.id), ...req.body })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// DELETE /employees/1
app.delete('/employees/:id', async (req, res) => {
  try {
    const [r] = await pool.query(
      'DELETE FROM employees WHERE id = ?', [req.params.id]
    )
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: 'Database error' })
  }
})

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`Employee Directory API running at http://localhost:${PORT}`)
)