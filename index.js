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
                    //viewAllDepartments();
                    break;
                case 'Add a Department':
                    // Add a Department function
                    //addDepartment();
                    break;
                case 'Update a Job Role':
                    // Update a Job Role function
                    //updateJobRole();
                    break;
                case 'View All Roles':
                    // View All Roles function
                    //viewAllRoles();
                    break;
                case 'Add a Role':
                    // Add a Role function
                    //addRole();
                    break;
                case 'Update an Employee':
                    // Update an Employee function
                    //updateEmployee();
                    break;
                case 'View all Employees':
                    // View all Employees function
                    //viewAllEmployees();
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