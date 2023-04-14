const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'workforce_db'
},
    console.log(`Connected to the workforce_db database.`));

// Making main menu function for more modular use of program


function mainMenu() {
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'Update Department',
                'View All Departments',
                'Add a Department',
                'Update a Job Role',
                'View All Roles',
                'Add a Role',
                'Update an Employee\'s Job Role',
                'View all Employees',
                'Add an Employee',
                'Quit'
            ]
        })
        .then(res => {
            switch (res.action) {
                case 'Update Department':
                    // Update Department function
                    updateDepartment();
                    break;
                case 'View All Departments':
                    // View All Departments function
                    viewAllDepartments();
                    break;
                case 'Add a Department':
                    // Add a Department function
                    addDepartment();
                    break;
                case 'Update a Job Role':
                    // Update a Job Role function
                    updateJobRole();
                    break;
                case 'View All Roles':
                    // View All Roles function
                    viewAllRoles();
                    break;
                case 'Add a Role':
                    // Add a Role function
                    addRole();
                    break;
                case 'Update an Employee\'s Job Role':
                    //Update an Employee function
                    updateEmployee();
                    break;
                case 'View all Employees':
                    // View all Employees function
                    viewAllEmployees();
                    break;
                case 'Add an Employee':
                    // Add an Employee function
                    addEmployee();
                    break;
                case 'Quit':
                    db.end();
                    process.exit();
            }
        })
}

// VIEW FUNCTIONS


function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }

        console.table(rows);
        mainMenu();
    });
}


function viewAllRoles() {
    db.query(`
        SELECT r.id, r.title, d.name AS department_name, r.salary
        FROM role r
        JOIN department d ON r.department_id = d.id;
    `, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Need this to be a string literal to avoid working with ugly strings

        console.table(rows);
        mainMenu();
    });
}


// Note here that we want left joins to include all of the employee's names in the table
function viewAllEmployees() {
    const query = `
        SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title, 
            d.name AS department, 
            r.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
            employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id;
    `;

    db.query(query, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.table(rows);
        mainMenu();
    });
}

// ADD FUNCTIONS keeping these modular to avoid complications in the original inquirer.prompt function


function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            name: 'dptName',
            message: 'What is the name of the department you would like to add?'
        })
        .then((response) => {
            db.query('INSERT INTO department (name) VALUES (?);', [response.dptName], (err, result) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(`Added ${response.dptName} to the database.`);

                }
                mainMenu();
            })
        })

}

function addRole() {

    // Need to include this to select all available departments
    db.query('SELECT id, name FROM department;', (err, result) => {
        if (err) {
            console.log(err.message);
        }
        else {
            // Format result into array of objects for inquirer choices
            const departmentChoices = result.map(department => {
                return {
                    name: department.name,
                    value: department.id
                }
            });

            // Inquirer prompt for new role information
            inquirer.prompt([
                // Role title input
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of the new role?'
                },
                // Salary input
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for the new role?'
                },
                // Department selection
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department is the new role in?',
                    choices: departmentChoices
                }
            ])
                .then((response) => {

                    // Insert new role into the database
                    db.query('INSERT INTO role SET ?',
                        {
                            title: response.title,
                            salary: response.salary,
                            department_id: response.department
                        },
                        (err, result) => {
                            if (err) {
                                console.log(err.message);
                            }
                            else {
                                console.log(`Added ${response.title} to the database.`);
                            }
                            mainMenu();
                        }
                    )
                });
        }
    });
}


function addEmployee() {

    // predefined lists for roles and employees
    let roleChoices = [];
    let employeeChoices = [];


    // Select and grab the roles for inquirer prompt
    db.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Maps our results into the array we want for later
        roleChoices = result.map(res => {
            return {
                name: res.title,
                value: res.id
            };
        });
    });

    // Going to do something similar to roles but for employees now
    db.query('SELECT * FROM employee WHERE employee.manager_id IS NULL', (err, result) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Maps our results into the array we want for later
        employeeChoices = result.map(res => {
            return {
                name: res.first_name + ' ' + res.last_name,
                value: res.id
            };
        });

        // Add a none option for the manager
        employeeChoices.push({
            name: 'None',
            value: null
        });

        // Going to nest the rest of the code in here to avoid duplication of code

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employee\'s first name?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employee\'s last name?'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is the employee\'s role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Who is the employee\'s manager?',
                    choices: employeeChoices
                }
            ])
            .then((response) => {
                // Insert new employee into the database
                db.query('INSERT INTO employee SET ?', {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.roleId,
                    manager_id: response.managerId || null
                }, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.log(`Added ${response.firstName} ${response.lastName} to the database.`);
                });
                mainMenu();
            })


    });

}



// UPDATE FUNCTIONS

function updateDepartment() {
    db.query('SELECT * FROM department', (err, result) => {

        if (err) {
            console.log(err.message);
            return;
        }

        const departmentChoices = result.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        });

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department would you like to update?',
                    choices: departmentChoices
                },
                {
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the new department name?'
                }
            ])
            .then((response) => {
                db.query('UPDATE department SET name =? WHERE id =?', [response.newDepartment, response.department], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.log(`Updated ${response.department.name} to ${response.newDepartment}`);
                    mainMenu();
                });
            });
    });
}


function updateJobRole() {
    db.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const roleChoices = result.map(role => {
            return {
                name: `${role.title} (${role.salary})`,
                value: role.id,
                department_id: role.department_id
            }
        });

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role would you like to update?',
                    choices: roleChoices
                },
                {
                    type: 'input',
                    name: 'newTitle',
                    message: 'What is the new role name? Note that this job must match within the current department it belongs to.'
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: 'What is the new salary for this role?'
                }
            ])
            .then((response) => {
                // Ensure that the updated role belongs to the same department
                const updatedRole = roleChoices.find(role => role.value === response.role);
                db.query('UPDATE role SET title =?, salary =? WHERE id =?', [response.newTitle, response.newSalary, response.role], (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.log(`Updated ${updatedRole.name} to ${response.newTitle} with a salary of ${response.newSalary}`);
                    mainMenu();
                });
            });
    });
}



function updateEmployee() {

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const employeeChoices = result.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
                role_id: employee.role_id
            }
        });

        // nested query for the callback function
        db.query('SELECT * FROM role', (err, result) => {
            if (err) {
                console.log(err.message);
                return;
            }
            const roleChoices = result.map(role => {
                return {
                    name: `${role.title} (${role.salary})`,
                    value: role.id,
                    department_id: role.department_id,
                    title: role.title,
                    salary: role.salary
                }
            });

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role for this employee?',
                        choices: roleChoices
                    },

                ])
                .then((response) => {
                    const updatedEmployee = employeeChoices.find(employee => employee.value === response.employee);
                    const updatedRole = roleChoices.find(role => role.value === response.role);

                    db.query('UPDATE employee SET role_id =? WHERE id =?', [response.role, response.employee], (err, result) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        console.log(`Updated ${updatedEmployee.name} to ${updatedRole.title} with a salary of ${updatedRole.salary}`);
                        mainMenu();
                    });
                });
        });
    });
}


//starts the program
mainMenu();