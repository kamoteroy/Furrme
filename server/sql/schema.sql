CREATE TABLE IF NOT EXISTS accounts (
	fname VARCHAR(200),
	image VARCHAR(2000),
	lname VARCHAR(200),
	email VARCHAR(200) UNIQUE,
	pass VARCHAR(200),
	role VARCHAR(200),
	PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS adoptreq (
	requestID INT AUTO_INCREMENT PRIMARY KEY,
	pet_id INT,
	pet_name VARCHAR(200),
	category VARCHAR(100),
	email VARCHAR(200),
	image VARCHAR(2000),
	address VARCHAR(300),
	contact VARCHAR(100),
	household TEXT,
	employment TEXT,
	pet_exp TEXT,
	dates DATE,
	status VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS community (
	postNumber INT AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(200),
	user_img VARCHAR(2000),
	description TEXT,
	dates DATE,
	image VARCHAR(2000),
	timePosted TIME
);

CREATE TABLE IF NOT EXISTS pets (
	pet_id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(200),
	category VARCHAR(100),
	address VARCHAR(300),
	description TEXT,
	color VARCHAR(100),
	gender VARCHAR(20),
	image VARCHAR(2000),
	breed VARCHAR(200),
	age VARCHAR(100),
	behavior VARCHAR(100),
	health VARCHAR(200),
	status VARCHAR(100),
	createdBy VARCHAR(200),
	adoptedBy VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS pet_img (
	pet_id INT PRIMARY KEY,
	img1 VARCHAR(2000),
	img2 VARCHAR(2000),
	img3 VARCHAR(2000),
	img4 VARCHAR(2000),
	img5 VARCHAR(2000)
);
