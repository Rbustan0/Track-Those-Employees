INSERT INTO department (name)
VALUES 
('Sales'), 
('Engineering'), 
('Finance'), 
('Software'),
('Legal');

INSERT INTO role (title, salary, department_id) 
VALUES
    -- Sales department
    ('Sales Manager', 100000, 1),
    ('Sales Representative', 60000, 1),
    ('Sales Associate', 40000, 1),

    -- Engineering department
    ('Engineering Manager', 120000, 2),
    ('Software Engineer', 90000, 2),
    ('Network Engineer', 85000, 2),

    -- Finance department
    ('Finance Manager', 110000, 3),
    ('Financial Analyst', 75000, 3),
    ('Accountant', 65000, 3),

    -- Software department
    ('Software Manager', 125000, 4),
    ('Frontend Developer', 95000, 4),
    ('Backend Developer', 90000, 4),

    -- Legal department
    ('Legal Manager', 115000, 5),
    ('Lawyer', 80000, 5),
    ('Paralegal', 60000, 5);


    -- Sample seeds (will be deleted later) --
    
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