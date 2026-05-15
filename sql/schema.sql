-- Create the employee_directory database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_directory
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the employee_directory database
USE employee_directory;

-- If the employees table already exists, drop it to start fresh
DROP TABLE IF EXISTS employees;

-- Create the employees table with the specified columns and constraints
CREATE TABLE employees (
  id         INT AUTO_INCREMENT PRIMARY KEY,  -- aauto-incrementing primary key
  empId      VARCHAR(10)   NOT NULL UNIQUE,   -- employee ID, max 10 characters, must be unique
  name       VARCHAR(120)  NOT NULL,           -- full name( At least 3 characters.)
  email      VARCHAR(120)  NOT NULL,           -- email( Must match a valid email pattern.)
  department VARCHAR(50)   NOT NULL,           -- department (selected from a dropdown)
  position   VARCHAR(100)  NOT NULL,           -- position (required)
  hireDate   DATE          NOT NULL,           -- hire date (Required. Cannot be in the future.)
  salary     DECIMAL(10,2) NOT NULL,           -- monthly salary (RM)
  active     TINYINT(1)    NOT NULL DEFAULT 1, -- employment status (1=active, 0=inactive)
  CHECK (salary >= 1500 AND salary <= 50000)  -- salary must be within range
) ENGINE=InnoDB;

INSERT INTO employees
  (empId, name, email, department, position, hireDate, salary, active)
VALUES
  ('EMP001', 'Ahmad Zulkarnain bin Hassan',
   'ahmad.zulkarnain@company.com.my',
   'IT', 'Senior Software Engineer', '2020-03-15', 8500.00, 1),

  ('EMP002', 'Nur Aisyah binti Abdullah',
   'nur.aisyah@company.com.my',
   'HR', 'Human Resources Manager', '2019-07-01', 9200.00, 1),

  ('EMP003', 'Muhammad Faris bin Razak',
   'muhammad.faris@company.com.my',
   'IT', 'Junior Developer', '2023-01-10', 3800.00, 1),

  ('EMP004', 'Siti Khadijah binti Ibrahim',
   'siti.khadijah@company.com.my',
   'Finance', 'Finance Analyst', '2021-05-20', 6500.00, 1),

  ('EMP005', 'Tan Wei Ming',
   'tan.weiming@company.com.my',
   'Marketing', 'Marketing Executive', '2022-08-08', 4200.00, 1),

  ('EMP006', 'Priya a/p Subramaniam',
   'priya.subramaniam@company.com.my',
   'Finance', 'Senior Accountant', '2018-11-25', 7800.00, 1),

  ('EMP007', 'Mohd Hafiz bin Othman',
   'mohd.hafiz@company.com.my',
   'IT', 'System Administrator', '2017-06-30', 7200.00, 0);
   -- EMP007: active=0 means this employee is inactive (dh lari?)