USE bamazon_DB;

	CREATE TABLE departments (
	  dept_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	  dept_name VARCHAR(30) NOT NULL,
	  overhead_costs DECIMAL(10, 2) NOT NULL,
	  PRIMARY KEY (dept_id)
	);

	ALTER TABLE inventory ADD product_sales DECIMAL(10, 2) NOT NULL DEFAULT 0;

	INSERT INTO departments (product_name, department_name, price, stock_quantity) 
		VALUES
			('Fidget Spinner', 'Toys', 11.99, 5000),
			('Furby', 'Toys', 14.99, 200),
			('Louisville Slugger', 'Sports', 39.99, 300),
			('Rawlings Baseball Glove', 'Sports', 79.99, 200),
			('Ektelon Racket', 'Sports', 59.99, 200),
			('Halo 5', 'Video Games', 59.99, 1000),
			('Star Wars Battlefront', 'Video Games', 39.99, 200),
			('Assassin\'s Creed', 'Video Games', 49.99, 100),
			('Adidas Superstar', 'Shoes', 59.99, 200),
			('Air Jordans', 'Shoes', 129.99, 4);