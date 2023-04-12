const inquirer = require('inquirer');
const mysql = require('mysql2');

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
                'Update an Employee',
                'View all Employees',
                'Add an Employee',
                'Quit'
            ]
        })
        .then(res => {
            switch (res.action) {
                case 'Update Department':
                    // Update Department function
                    //updateDepartment();
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
                    //updateJobRole();
                    break;
                case 'View All Roles':
                    // View All Roles function
                    viewAllRoles();
                    break;
                case 'Add a Role':
                    // Add a Role function
                    addRole();
                    break;
                case 'Update an Employee':
                    // Update an Employee function
                    //updateEmployee();
                    break;
                case 'View all Employees':
                    // View all Employees function
                    viewAllEmployees();
                    break;
                case 'Add an Employee':
                    // Add an Employee function
                    //addEmployee();
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

        // Construct string output
        let output = "ID\t| Department\n";
        output += "-".repeat(20) + "\n"; // divider line

        rows.forEach((row) => {
            output += `${row.id}\t| ${row.name}\n`;
        });

        console.log(output);
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

        let output = "ID  | Title                | Department      | Salary\n";
        output += "-".repeat(60) + "\n";

        rows.forEach((row) => {
            const id = row.id.toString().padStart(3, " ");
            const title = row.title.padEnd(20, " ");
            const department = row.department_name.padEnd(15, " ");
            const salary = row.salary.toString().padStart(7, " ");

            output += `${id} | ${title} | ${department} | ${salary}\n`;
        });

        console.log(output);
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
    db.query('SELECT name FROM department;', (err, result) => {
        if (err) {
            console.log(err.message);
        }
        else {
            // Format result into array of objects for inquirer choices
            const departmentChoices = result.map(department => {
                return {
                    name: department.name,
                    value: department.name
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
                    // Use the selected department name to get the department id
                    const departmentId = result.find(department => department.name === response.department).id;

                    // Insert new role into the database
                    db.query('INSERT INTO role SET ?',
                        {
                            title: response.title,
                            salary: response.salary,
                            department_id: departmentId
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





//starts the program
mainMenu();