const table = require("console.table");
const db = require("./db/connection");
const express = require("express");
const inputCheck = require("./utils/inputCheck");
// Add near the top of the file
const apiRoutes = require("./routes/apiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Add after Express middleware
app.use("/api", apiRoutes);

function questions() {
	inquirer
		.prompt({
			message: "what would you like to do?",
			type: "list",
			choices: [
				"view all of the employees",
				"view all of the departments",
				"view all of the roles",
				"add an employee",
				"add a department",
				"add a role",
				"update an employee role",
				"quit",
			],
			name: "choice",
		})
		.then(answers => {
			console.log(answers.choice);
			switch (answers.choice) {
				case "view all of the employees":
					viewEmployees();
					break;

				case "view all of the departments":
					viewDepartments();
					break;

				case "view all of the roles":
					viewRoles();
					break;

				case "add an employee":
					addEmployee();
					break;

				case "add a department":
					addDepartment();
					break;

				case "add a role":
					addRole();
					break;

				case "update an employee role":
					updateEmployeeRole();
					break;

				default:
					db.end();
					break;
			}
		});
}

// Get all employees
function viewEmployees() {
	app.get("/api/employee", (req, res) => {
		const sql = `SELECT * FROM employees`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({
				message: "success",
				data: rows,
			});
		});
	});
	console.table(data);
	questions();
}

// Get all departments
function viewDepartments() {
	app.get("/api/department", (req, res) => {
		const sql = `SELECT * FROM department`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({
				message: "success",
				data: rows,
			});
		});
	});
	console.table(data);
	questions();
}

// Get all roles
function viewRoles() {
	app.get("/api/roles", (req, res) => {
		const sql = `SELECT * FROM roles`;

		db.query(sql, (err, rows) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.json({
				message: "success",
				data: rows,
			});
		});
	});
	console.table(data);
	questions();
}

//add department
function addDepartment() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "department",
				message: "Which Department did you want to add?",
			},
		])
		.then(function (res) {
			// Create a department
			app.post("/api/department", ({ body }, res) => {
				// department is added
				const errors = inputCheck(body, "name");
				if (errors) {
					res.status(400).json({ error: errors });
					return;
				}

				const sql = `INSERT INTO department (name) VALUES (?)`;
				const params = [body.name];

				db.query(sql, params, (err, result) => {
					if (err) {
						res.status(400).json({ error: err.message });
						return;
					}
					res.json({
						message: "success",
						data: body,
						changes: result.affectedRows,
					});
				});
			});
		});
	questions();
}

//add role
function addRole() {
	// Create a department
	app.post("/api/roles", ({ body }, res) => {
		// department is added
		const errors = inputCheck(body, "title", "salary", "dept_id");
		if (errors) {
			res.status(400).json({ error: errors });
			return;
		}

		const sql = `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`;
		const params = [body.title, body.salary, body.department_id];

		db.query(sql, params, (err, result) => {
			if (err) {
				res.status(400).json({ error: err.message });
				return;
			}
			res.json({
				message: "success",
				data: body,
				changes: result.affectedRows,
			});
		});
	});
	questions();
}

//update employee role
function updateEmployeeRole() {
	inquirer
		.prompt([
			{
				message: "which employee would you like to update? (use first name only for now)",
				type: "input",
				name: "name",
			},
			{
				message: "enter the new role ID:",
				type: "number",
				name: "role_id",
			},
		])
		.then(function (response) {
			db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data) {});
			questions();
		});
}

//add employee
function addEmployee() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "firstName",
				message: "What is the employee's first name?",
			},
			{
				type: "input",
				name: "lastName",
				message: "What is the employee's last name?",
			},
			{
				type: "number",
				name: "roleId",
				message: "What is the employee's role ID",
			},
			{
				type: "number",
				name: "managerId",
				message: "What is the employee's manager's ID?",
			},
		])
		.then(function (res) {
			db.query(
				"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
				[res.firstName, res.lastName, res.roleId, res.managerId],
				function (err, data) {
					if (err) throw err;
					console.table("Successfully Inserted");
					questions();
				}
			);
		});
}

// Not Found response for unmatched routes
app.use((req, res) => {
	res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
	if (err) throw err;
	console.log("Database connected.");
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

questions();
