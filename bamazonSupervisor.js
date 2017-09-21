var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');

function sqlObj() {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'bamazon_DB'
    });
}

function actionPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "actionPrompt",
        message: "What would you like to do?",
        choices: ["View Products Sales by Department",
            "Add New Department",
            "Quit"
        ]
    }]).then(function(response) {
        if (response.actionPrompt === "Quit") {
            process.exit();
        } else if (response.actionPrompt === "View Products Sales by Department") {
            sqlConnect(viewSalesByDept);
        } else {
            addDeptMenu();
        }
    });
}

function sqlConnect(callback, obj) {
    var connection = sqlObj();
    connection.connect();
    callback(connection, obj);
    connection.end();
}

function viewSalesByDept(connection) {
    connection.query('SELECT dept_id, dept_name, overhead_costs, SUM(product_sales), SUM(product_sales) - overhead_costs AS total_profit FROM departments LEFT JOIN inventory ON dept_name = department_name GROUP BY dept_name;', function(error, results, fields) {
        if (error) throw error;
        console.table("\n", results);
        actionPrompt();
    });
}

function addDeptMenu() {
    inquirer
        .prompt([{
            name: "deptName",
            type: "input",
            message: "Enter a name for the new department",
        }, {
            name: "overhead",
            type: "input",
            message: "Enter the overhead costs for this department"
        }])
        .then(function(answer) {
        	console.log('deptName', answer.deptName);
        	console.log('overhead', answer.overhead);
            sqlConnect(addDept, answer);
        });
}

function addDept(connection, obj) {
	connection.query(`INSERT INTO departments (dept_name, overhead_costs)
VALUES ("${obj.deptName}", "${obj.overhead}");`, function(error, results, fields) {
        if (error) throw error;
        console.log("\n \t Department successfully added.\n");
        actionPrompt();
    });
}

console.log("\n\t***** Welcome to the Bamazon Supervisor Portal *****\n");
actionPrompt();