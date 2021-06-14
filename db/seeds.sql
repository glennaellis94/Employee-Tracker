INSERT INTO department (name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Lawyer");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Lead Sales", 50000, 1),        
("Lead Engineer", 80000, 2),       
("Accountant", 60000, 3),        
("Legal Team", 100000, 4);        

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Glenn", "Ellis", 1, 3),
("Krystal", "Ellis", 2, 2),
("Dwayne", "Best", 2, 1),
("Maryellen", "Goshell", 3, 4),
("Becky", "Wilson", 4, 5),
("Jay", "Turner", 3, 3),
