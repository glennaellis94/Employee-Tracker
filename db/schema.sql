CREATE TABLE roles(
  role_id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(2),
  dept_id INTEGER REFERENCES departments(id),
  PRIMARY KEY(role_id)
);

CREATE TABLE departments(
  dept_id INTEGER AUTO_INCREMENT NOT NULL,
  dept_name VARCHAR(30),
  PRIMARY KEY(dept_id)
);

CREATE TABLE employees(
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER REFERENCES roles(role_id),
  manager_id INTEGER DEFAULT 0 REFERENCES departments(dept_id),
  PRIMARY KEY(id)
);