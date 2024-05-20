CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    role VARCHAR(50) not null default 2
);
    CREATE TABLE IF NOT EXISTS Customer (
    cid INT PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    age INT,
    date_of_reg DATE NOT NULL,
    house_number VARCHAR(10) NOT NULL DEFAULT "B-252",
    street_name VARCHAR(100) NOT NULL DEFAULT "Sector-23",
    city VARCHAR(50) NOT NULL DEFAULT "NOIDA",
    state VARCHAR(50) NOT NULL DEFAULT "UP",
    pincode VARCHAR(10) NOT NULL DEFAULT "201308",
    foreign key(cid) references users(id));

    CREATE TABLE IF NOT EXISTS Customer_Phone_no (
    cid INT NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    PRIMARY KEY (cid, phone_no),
    FOREIGN KEY (cid) REFERENCES Customer(cid)
);

CREATE TABLE IF NOT EXISTS Customer_Email_ID (
    cid INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (cid, email),
    FOREIGN KEY (cid) REFERENCES Customer(cid)
);
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS Pizza (
    pizza_id INT AUTO_INCREMENT PRIMARY KEY,
    pizza_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    pizza_image_url VARCHAR(1000)
);
CREATE TABLE IF NOT EXISTS pizza_crust (
    crust_id INT NOT NULL PRIMARY KEY auto_increment,
    crust_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
CREATE TABLE IF NOT EXISTS pizza_size (
    size_id INT NOT NULL PRIMARY KEY auto_increment,
    size_name VARCHAR(50) NOT NULL,
    cost_multiplier DECIMAL(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS toppings (
    topping_id  INT NOT NULL PRIMARY KEY auto_increment,
    topping_name VARCHAR(50) NOT NULL,
    price DECIMAL(5, 2) NOT NULL
);
CREATE TABLE IF NOT EXISTS DeliveryPartners (
    partner_id INT NOT NULL PRIMARY KEY auto_increment,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT "ACTIVE",
    city VARCHAR(50) NOT NULL,
    foreign key (user_id) REFERENCES users(id) ON delete cascade
);
CREATE TABLE IF NOT EXISTS Kitchen (
    kitchen_id INT NOT null primary KEY auto_increment,
    street_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    plot_no VARCHAR(15)
);
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    pizza_id INT NOT NULL,
    quantity INT NOT NULL,
    crust_id INT NOT NULL,
    size_id INT NOT NULL,
    identifier VARCHAR(256) NOT NULL,
    FOREIGN KEY (crust_id) REFERENCES pizza_crust(crust_id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES pizza_size(size_id) ON DELETE CASCADE,
    FOREIGN KEY (pizza_id) REFERENCES pizza(pizza_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_item_toppings (
    cart_id INT NOT NULL,
    topping_id INT NOT NULL auto_increment,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id) ON DELETE CASCADE,
    primary key(cart_id,topping_id)
);
CREATE TABLE IF NOT EXISTS transactions (
	transaction_id VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    transaction_date timestamp NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY(customer_id) REFERENCES Customer(cid) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `Order` (
    order_id INT NOT NULL auto_increment PRIMARY KEY,
    customer_id INT NOT NULL,
    kitchen_id INT NOT NULL,
    partner_id INT NOT NULL,
    transaction_id VARCHAR(255),
    order_timestamp timestamp NOT NULL default current_timestamp,
    total_amount DECIMAL(10, 2) NOT NULL default 0.0,
    delivery_status VARCHAR(50) NOT NULL default "WITH RESTAURANT" ,
    FOREIGN KEY (customer_id) REFERENCES Customer(cid),
    FOREIGN KEY (kitchen_id) REFERENCES Kitchen(kitchen_id),
    FOREIGN KEY (partner_id) REFERENCES DeliveryPartners(partner_id),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id)
);
CREATE TABLE IF NOT EXISTS OrderItems (
    order_item_id INT NOT NULL auto_increment,
    order_id INT NOT NULL,
    pizza_id INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    crust_id INT NOT NULL,
    size_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_item_id, order_id),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
    FOREIGN KEY (pizza_id) REFERENCES pizza(pizza_id),
    FOREIGN KEY (crust_id) REFERENCES pizza_crust(crust_id),
    FOREIGN KEY (size_id) REFERENCES pizza_size(size_id)
);
CREATE TABLE IF NOT EXISTS order_item_toppings (
    order_item_id INT NOT NULL,
    topping_id INT NOT NULL auto_increment,
    FOREIGN KEY (order_item_id) REFERENCES OrderItems(order_item_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id) ON DELETE CASCADE,
    primary key(order_item_id,topping_id)
);

CREATE TABLE IF NOT EXISTS Coupons (
    coupon_id INT PRIMARY KEY,
    coupon_code varchar(100),
    ActivationPrice DECIMAL(10, 2),
    DiscountPrice DECIMAL(10, 2)
);