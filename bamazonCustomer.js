var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_DB'
});

function actionPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "actionPrompt",
        message: "What would you like to do next?",
        choices: ["Go shopping", "Quit"]
    }]).then(function(response) {
        if (response.actionPrompt === "Quit") {
            process.exit();
        } else {
            initializeStore();
        }
    });
}

function initializeStore() {
	var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_DB'
});
    connection.connect();
    query();
    connection.end();
}

function query() {
    connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM inventory;', function(error, results, fields) {
        if (error) throw error;
        console.log('\n');
        console.table(results);
        itemPrompt(results);
    });
}

function itemPrompt(sqlResponse) {
    inquirer
        .prompt([{
            name: "itemID",
            type: "input",
            message: "Enter the item ID you would like to purchase:",
        }, {
            name: "quantity",
            type: "input",
            message: "Enter the quantity:"
        }])
        .then(function(answer) {
            var valid = validItemID(sqlResponse, answer);

            if (valid === false) {
                console.log('\n\tThe ID you entered does not match any of the products.\n');
                itemPrompt(sqlResponse);
            } else {
                validItemQuantity(sqlResponse, answer, valid);
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

function validItemQuantity(sqlResponse, userInput, index) {
    var itemObj = sqlResponse[index];

    if (itemObj.stock_quantity < parseInt(userInput.quantity) ||
        parseInt(userInput.quantity) <= 0) {
        console.log("\n\tYou did not enter a valid quantity.\n")
        itemPrompt(sqlResponse);
    } else {
        transaction(itemObj, userInput.quantity);
    }
}

function transaction(itemObj, quantity) {
    var newStock = itemObj.stock_quantity - quantity;
    var cost = itemObj.price * quantity;

    var newConnection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'bamazon_DB'
    });

    var sale = itemObj.price * quantity;
    newConnection.connect();
    newConnection.query(`UPDATE inventory SET stock_quantity = ${newStock} WHERE item_id = ${itemObj.item_id}`,
        function(error, results, fields) {
            if (error) throw error;
        });
    newConnection.query(`UPDATE inventory SET product_sales = product_sales + ${sale} WHERE item_id = ${itemObj.item_id}`,
        function(error, results, fields) {
            if (error) throw error;
        });
    newConnection.end();
    // update table to reflect sales
    console.log(`\n\tYour total cost for this transaction: $${cost.toFixed(2)}\n`)
    actionPrompt();
}

console.log("\n\t***** Welcome to Bamazon *****\n");
actionPrompt();

