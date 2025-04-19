require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const saltRounds = 10; // Change 'salt' to 'saltRounds'
const page = require("./controllers/pageController");
const user = require("./controllers/userController");
const admin = require("./controllers/adminController");
const { upload, uploadMulti } = require("./controllers/upload");
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

db.connect((err) => {
	if (err) {
		console.error("Error connecting to the database: " + err.stack);
		return;
	}
	const queries = `
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
	`;

	db.query(queries, (err, result) => {
		if (err) {
			console.error("Error creating tables:", err);
		} else {
			console.log("All tables ensured on server start.");
			insertInitialData();
		}
	});
	console.log("Connected to the database");
});

function insertInitialData() {
	const data = JSON.parse(
		fs.readFileSync(path.join(__dirname, "furrme.json"), "utf8")
	);
	for (const entry of data) {
		if (entry.type === "table") {
			const table = entry.name;
			const rows = entry.data;
			if (rows && rows.length > 0) {
				const keys = Object.keys(rows[0]);
				const placeholders = keys.map(() => "?").join(",");
				const sql = `INSERT IGNORE INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`;

				rows.forEach((row) => {
					const values = keys.map((key) => row[key]);
					db.query(sql, values, (err) => {
						if (err) {
							console.error(`Error inserting into ${table}:`, err);
						}
					});
				});
			}
		}
	}
}

app.listen(3001, () => {
	console.log("Running on port 3001...");
});

const verifyJWT = (req, res, next) => {
	var token;
	token = req.headers.token;

	if (!token) {
		token = req.body.token;
	}
	console.log(token);
	try {
		const validToken = jwt.verify(token, "jwtRoy");
		if (validToken) {
			next();
		}
	} catch (err) {
		res.json({ auth: false, message: "No Access" });
	}
};

app.get("/testdb", (req, res) => {
	db.query("SHOW TABLES;", (err, result) => {
		if (err) return res.status(500).json({ error: err });
		res.json(result);
	});
});

app.post("/upload", upload);

app.get("/pets", page.getPets);
app.get("/pets/cats", page.getCats);
app.get("/pets/dogs", page.getDogs);

app.post("/login", user.logIn);
app.post("/signup", user.signUp);
app.post("/manage", verifyJWT, user.manageProfile);
app.post("/addpost", verifyJWT, user.addPost);
app.get("/community", verifyJWT, user.communityList);
app.post("/adoptReq", verifyJWT, user.adoptionRequest);
app.get("/petPreview/:id", user.getpetPreview);

app.get("/admin", verifyJWT, admin.adminPetList);
app.get("/admin/petDetails/:id", verifyJWT, admin.getpetDetails);
app.get("/admin/petImage/:id", verifyJWT, admin.getpetImages);
app.get("/admin/adoptReq/:id", verifyJWT, admin.getAdoptReq);

app.get("/adoption/list", verifyJWT, admin.adoptionList);
app.post("/admin/petInfoUpdate", verifyJWT, admin.updatePetInfo);
app.post("/admin/evaluation/accDetails", verifyJWT, admin.accDetails);

app.post("/admin/create", async (req, res) => {
	const creator = jwt.verify(req.body.token, "jwtRoy");
	const petInfo = req.body.data;
	const images = req.body.images;
	const getMax = "SELECT MAX(pet_id) AS maxID FROM pets;";
	const updateQuery =
		"INSERT INTO pets (`pet_id`, `name`, `category`, `address`, `description`, `color`, `gender`, `image`, `breed`, `age`, `behavior`, `health`, `status`, createdBy, adoptedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	const imgQuery =
		"INSERT INTO pet_img (`pet_id`, `img1`, `img2`, `img3`, `img4`, `img5`) VALUES (?,?,?,?,?,?)";
	db.query(getMax, (err, resultMax) => {
		const maxID = resultMax[0].maxID + 1;
		db.query(
			updateQuery,
			[
				maxID,
				petInfo.name,
				req.body.type,
				petInfo.address,
				petInfo.description,
				petInfo.color,
				req.body.gender,
				req.body.images[0],
				petInfo.breed,
				petInfo.age,
				petInfo.behavior,
				petInfo.health,
				"Available",
				creator,
				null,
			],
			(err, result) => {
				if (err) return err;
				db.query(
					imgQuery,
					[maxID, images[0], images[1], images[2], images[3], images[4]],
					(err, resImg) => {
						if (err) return err;
						return res.json({ resImg: resImg, maxID: maxID });
					}
				);
			}
		);
	});
});

app.post("/admin/evaluation/pet", (req, res) => {
	db.query(
		"select * from pets where pet_id = ?",
		[req.body.id],
		(err, petInfo) => {
			if (err) {
				console.log(err);
			}
			return res.json(petInfo);
		}
	);
});

app.post("/admin/setStatus", (req, res) => {
	db.query(
		"UPDATE adoptreq SET status = ? WHERE pet_id = ? and email = ?",
		[req.body.status, req.body.id, req.body.email],
		(err, accInfo) => {
			if (err) {
				console.log(err);
			}
			return res.json({ Status: `${req.body.status} Successfully!` });
		}
	);
});

app.post("/emailValidate", (req, res) => {
	db.query("select email from accounts;", (err, list) => {
		if (err) {
			console.log(err);
		} else {
			return res.json(list);
		}
	});
});

app.post("/createAdmin", (req, res) => {
	db.query(
		"CREATE TABLE IF NOT EXISTS accounts(fname varchar(200),image varchar(2000),lname varchar(200),email varchar(200) unique,pass varchar(200),role varchar(200),primary key(email));",
		(err, result) => {
			if (err) {
				console.log(err);
			}
		}
	);
});
