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

function sqlConnect(callback, param1, param2) {
    var connection = sqlObj();
    connection.connect();
    callback(connection, param1, param2);
    connection.end();
}

function displayInventory(connection) {
    connection.query('SELECT * FROM inventory;', function(error, results, fields) {
        if (error) throw error;
        console.log("\n");
        console.table(results);
        actionPrompt();
    });
}

function viewLowInventory(connection) {
    connection.query('SELECT * FROM inventory WHERE stock_quantity < 5;', function(error, results, fields) {
        if (error) throw error;
        console.table(results);
        actionPrompt();
    });
}

function displayInventoryAddMenu(connection) {
    connection.query('SELECT * FROM inventory;', function(error, results, fields) {
        if (error) throw error;
        console.table(results);
        addInventoryMenu(results);
    });
}

function updateInventory(connection, id, quantity) {
    connection.query(`UPDATE inventory SET stock_quantity = stock_quantity + ${quantity} WHERE item_id = ${id};`, function(error, results, fields) {
        if (error) {
            throw error;
        } else {
            console.log("\n\tInventory successfully updated.\n")
        }

        actionPrompt();
    });
}

function addNewItem(connection, itemObj) {
    connection.query(`INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("${itemObj.name}", "${itemObj.department}", ${itemObj.price}, ${itemObj.quantity});`, function(error, results, fields) {
        if (error) {
            throw error;
        } else {
            console.log("\n\tInventory successfully updated.\n")
        }
        actionPrompt();
    });
}

function addNewItemMenu() {
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "Enter a name for the new item:",
        }, {
            name: "department",
            type: "input",
            message: "What department will this item be in?"
        }, {
            name: "price",
            type: "input",
            message: "Item price:"
        }, {
            name: "quantity",
            type: "input",
            message: "Quantity of the item that will be in stock:"
        }])
        .then(function(answer) {
            sqlConnect(addNewItem, answer);
        });
}

function addInventoryMenu(sqlResponse) {
    inquirer
        .prompt([{
            name: "itemID",
            type: "input",
            message: "Enter the item ID you would like to add inventory to:",
        }, {
            name: "quantity",
            type: "input",
            message: "Enter the quantity you'd like to add:"
        }])
        .then(function(answer) {
            var valid = validItemID(sqlResponse, answer);

            if (valid === false) {
                console.log('\n\tThe ID you entered does not match any of the products.\n');
                actionPrompt();
            } else if (answer.quantity <= 0) {
                console.log(`\n\t${answer.quantity} is not a valid quantity.\n`);
                actionPrompt();
            } else {
                sqlConnect(updateInventory, answer.itemID, answer.quantity);
            }
        });
}

function validItemID(sqlResponse, userInput) {
    var itemCheck = [];

    for (obj in sqlResponse) {
        if (sqlResponse[obj].item_id === parseInt(userInput.itemID)) {
            var itemObj = sqlResponse[obj];
            itemCheck.push(true);
        } else {
            itemCheck.push(false);
        }
    }
    if (itemCheck.indexOf(true) === -1) {
        return false;
    } else {
        return itemCheck.indexOf(true);
    }
}

function actionPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "actionPrompt",
        message: "What would you like to do next?",
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ]
    }]).then(function(response) {
        if (response.actionPrompt === "Quit") {
            process.exit();
        } else if (response.actionPrompt === "View Products for Sale") {
            sqlConnect(displayInventory);
        } else if (response.actionPrompt === "View Low Inventory") {
            sqlConnect(viewLowInventory);
        } else if (response.actionPrompt === "Add to Inventory") {
            sqlConnect(displayInventoryAddMenu);
        } else if (response.actionPrompt === "Add New Product") {
            addNewItemMenu();
        }
    });
}

console.log("\n\t***** Welcome to the Bamazon Manager Portal *****\n");
actionPrompt();