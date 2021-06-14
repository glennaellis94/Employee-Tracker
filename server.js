// const express = require("express");
// const db = require("./db/connection");
// const apiRoutes = require("./routes/apiRoutes");

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Use apiRoutes
// app.use("/api", apiRoutes);

// // Default response for any other request (Not Found)
// app.use((req, res) => {
// 	res.status(404).end();
// });

// // Start server after DB connection
// db.connect(err => {
// 	if (err) throw err;
// 	console.log("Database connected.");
// 	app.listen(PORT, () => {
// 		console.log(`Server running on port ${PORT}`);
// 	});
// });
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
// app.use("/api", apiRoutes);

function questions() {
	inquirer
		.prompt({
			message: "what would you like to do?",
			type: "list",
			choices: [
				"view all of the employees",
				"view all of the departments",
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
	app.get("/api/employees", (req, res) => {
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
}

// Get all departments
function viewDepartments() {
	app.get("/api/employees", (req, res) => {
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
}

// Get single candidate with party affiliation
app.get("/api/candidate/:id", (req, res) => {
	const sql = `SELECT candidates.*, parties.name
               AS party_name
               FROM candidates
               LEFT JOIN parties
               ON candidates.party_id = parties.id
               WHERE candidates.id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: row,
		});
	});
});

// Create a candidate
app.post("/api/candidate", ({ body }, res) => {
	// Candidate is allowed not to be affiliated with a party
	const errors = inputCheck(body, "first_name", "last_name", "industry_connected");
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}

	const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
	const params = [body.first_name, body.last_name, body.industry_connected, body.party_id];

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

// Update a candidate's party
app.put("/api/candidate/:id", (req, res) => {
	// Candidate is allowed to not have party affiliation
	const errors = inputCheck(req.body, "party_id");
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}

	const sql = `UPDATE candidates SET party_id = ?
               WHERE id = ?`;
	const params = [req.body.party_id, req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			// check if a record was found
		} else if (!result.affectedRows) {
			res.json({
				message: "Candidate not found",
			});
		} else {
			res.json({
				message: "success",
				data: req.body,
				changes: result.affectedRows,
			});
		}
	});
});

// Delete a candidate
app.delete("/api/candidate/:id", (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.statusMessage(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: "Candidate not found",
			});
		} else {
			res.json({
				message: "deleted",
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

// Get all parties
app.get("/api/parties", (req, res) => {
	const sql = `SELECT * FROM parties`;
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

// Get single party
app.get("/api/party/:id", (req, res) => {
	const sql = `SELECT * FROM parties WHERE id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: row,
		});
	});
});

// Delete a party
app.delete("/api/party/:id", (req, res) => {
	const sql = `DELETE FROM parties WHERE id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: res.message });
			// checks if anything was deleted
		} else if (!result.affectedRows) {
			res.json({
				message: "Party not found",
			});
		} else {
			res.json({
				message: "deleted",
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

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
