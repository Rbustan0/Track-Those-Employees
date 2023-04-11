DROP DATABASE IF EXISTS workforce_db;
CREATE DATABASE workforce_db;

USE workforce_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY(role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,

    --IF ENTRY EMPTY WILL SET TO its own id--
    FOREIGN KEY(manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    -- Sales department
    ('John', 'Doe', 2, 1), -- Sales Representative
    ('Jane', 'Smith', 3, 1), -- Sales Associate
    ('Mark', 'Johnson', 1, null), -- Sales Manager

    -- Engineering department
    ('Bob', 'Brown', 4, 5), -- Engineering Manager
    ('Sarah', 'Jones', 5, 4), -- Software Engineer
    ('David', 'Lee', 6, 4), -- Network Engineer
    ('Karen', 'Miller', 4, null), -- Engineering Manager

    -- Finance department
    ('Tom', 'Wilson', 7, 8), -- Finance Manager
    ('Mary', 'Taylor', 8, 7), -- Financial Analyst
    ('Joe', 'Clark', 9, 7), -- Accountant
    ('Jessica', 'Davis', 7, null), -- Finance Manager

    -- Software department
    ('Michael', 'Brown', 10, 11), -- Software Manager
    ('Emily', 'Garcia', 11, 10), -- Frontend Developer
    ('Kevin', 'Lee', 12, 10), -- Backend Developer
    ('Andrew', 'Kim', 10, null), -- Software Manager

    -- Legal department
    ('Ashley', 'Johnson', 13, 14), -- Legal Manager
    ('Ryan', 'Martinez', 14, 13), -- Lawyer
    ('Lisa', 'Anderson', 15, 13), -- Paralegal
    ('Adam', 'Wilson', 13, null); -- Legal Manager
This inserts one employee for each role, with a manager specified where applicable.


-- Keeping for now--
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    -- Sales department
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Bob', 'Johnson', 3, 1),

    -- Engineering department
    ('Mark', 'Jones', 4, NULL),
    ('Emily', 'Davis', 5, 4),
    ('Chris', 'Wilson', 6, 4),

    -- Finance department
    ('Tom', 'Brown', 7, NULL),
    ('Kelly', 'Taylor', 8, 7),
    ('Mike', 'Clark', 9, 7),

    -- Software department
    ('Kevin', 'Lee', 10, NULL),
    ('Sophie', 'Garcia', 11, 10),
    ('Ethan', 'Kim', 12, 10),

    -- Legal department
    ('Samantha', 'Miller', 13, NULL),
    ('Alex', 'Gomez', 14, 13),
    ('Maria', 'Hernandez', 15, 13);