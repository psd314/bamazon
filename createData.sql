USE bamazon_DB;

-- UPDATE inventory SET stock_quantity = stock_quantity + 1 WHERE item_id = 10;
-- INSERT INTO inventory (product_name, department_name, price, stock_quantity)
-- VALUES ("ball", "sports", 10,  110);

-- DELETE FROM inventory WHERE item_id = 14 OR item_id = 15;

-- ALTER TABLE inventory ADD product_sales DECIMAL(10, 2) NOT NULL DEFAULT 0;
-- overhead = sales * sum(price) * .25
-- DELETE FROM departments WHERE dept_id = 17;
SELECT * FROM departments;

-- INSERT INTO departments (dept_name) SELECT department_name FROM inventory GROUP BY department_name;

-- supervisor table
-- SELECT dept_id, dept_name, overhead_costs, product_sales, product_sales - overhead_costs AS total_profit FROM departments JOIN inventory ON dept_name = department_name
-- GROUP BY dept_name;