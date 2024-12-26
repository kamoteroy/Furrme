const db = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloud = require("cloudinary").v2;

cloud.config({
	api_key: process.env.api_key,
	cloud_name: process.env.cloud_name,
	api_secret: process.env.api_secret,
});

async function logIn(req, res) {
	const email_check = "select * from accounts where email = ?";
	const password_check = "select pass from accounts where email = ?";

	db.query(email_check, [req.body.email], (err, isThereAcc) => {
		if (!isThereAcc[0])
			return res.json({ auth: false, message: "No Email Found!" });
		db.query(password_check, [req.body.email], async (err, result_pass) => {
			const result = await bcrypt.compare(
				req.body.password,
				result_pass[0].pass
			);
			if (err) throw err;
			if (result) {
				const email = isThereAcc[0].email;
				const token = jwt.sign(email, "jwtRoy");
				return res
					.header("Authorization", token)
					.json({ token: token, userData: isThereAcc[0] });
			} else {
				return res.json({ message: "Incorrect Password!" });
			}
		});
	});
}

async function signUp(req, res) {
	const user = req.body.formData;
	const pass = req.body.password;
	const sql =
		"INSERT into accounts(fname, lname, email, pass, image, role) VALUES (?, ?, ?, ?, ?, ?)";
	const emailQuery = "select email from accounts where email = ?";

	db.query(emailQuery, [user.email], async (err, result_email) => {
		if (!result_email[0]) {
			const hashedPassword = await bcrypt.hash(pass, 10);
			db.query(
				sql,
				[
					user.fname,
					user.lname,
					user.email,
					hashedPassword,
					user.image,
					user.role,
				],
				(err, results) => {
					if (err)
						return res.json({ message: "Error Inserting data in server" });
					return res.json({ message: "Success" });
				}
			);
		} else {
			return res.json({ message: "Email already used" });
		}
	});
}

async function manageProfile(req, res) {
	var taken = 0; // 0 if same 1
	const email = jwt.verify(req.body.token, "jwtRoy");
	const updateInfo =
		"UPDATE accounts set fname = ?, lname = ?, email = ?, pass = ?, image = ? where email = ?";
	const accInfo = `select * from accounts where email = ?`;
	const hashedPassword = await bcrypt.hash(req.body.pass, 10);

	if (email != req.body.newEmail) {
		await new Promise((res, rej) => {
			db.query(accInfo, req.body.newEmail, (err, info) => {
				if (err) rej();
				if (info[0]) taken = 1;
				res();
			});
		});
	}

	if (taken === 1) return res.json({ message: "Email Taken", access: 0 });
	else if (taken === 0) {
		db.query(
			updateInfo,
			[
				req.body.fname,
				req.body.lname,
				req.body.newEmail,
				hashedPassword,
				req.body.image,
				req.body.prevEmail,
			],
			(err, result) => {
				if (err) console.log(err);
				else {
					db.query(accInfo, req.body.newEmail, (err, info) => {
						const newToken = jwt.sign(req.body.newEmail, "jwtRoy");
						if (err) console.log(err);
						else
							return res.json({
								userData: info[0],
								token: newToken,
								message: "Info Updated Successfully",
								access: 1,
							});
					});
				}
			}
		);
	}
}

async function addPost(req, res) {
	const addpost =
		"INSERT into community(postNumber, user_name, user_img, description, dates, image, timePosted) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const sql = "SELECT * from community";
	const token = jwt.verify(req.headers.token, "jwtRoy");
	if (token) {
		db.query(
			addpost,
			[
				req.body.id,
				req.body.user_name,
				req.body.user_img,
				req.body.description,
				req.body.date,
				req.body.image,
				req.body.timePosted,
			],
			(err, result) => {
				if (err) console.log(err);
				db.query(sql, (err, postList) => {
					if (err) console.log(err);
					return res.json(postList);
				});
			}
		);
	} else {
		res.json({ message: "No fcking Access" });
	}
}

async function communityList(req, res) {
	db.query(
		"select * from community ORDER BY postNumber desc",
		(err, postList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(postList);
			}
		}
	);
}

async function adoptionRequest(req, res) {
	const addpost =
		"INSERT into adoptreq(pet_id, pet_name, category, email, image, address, contact, household, employment, pet_exp, dates, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.query(
		addpost,
		[
			req.body.id,
			req.body.name,
			req.body.category,
			req.body.email,
			req.body.image,
			req.body.address,
			req.body.contact,
			req.body.household,
			req.body.employment,
			req.body.pet_exp,
			req.body.date,
			req.body.status,
		],
		(err, result) => {
			if (err) res.json({ message: "Error Applying" }), console.log(err);
			return res.json({ message: "Adoption Application Successful!" });
		}
	);
}

async function getpetPreview(req, res) {
	console.log(req.params.id);
	db.query(
		"SELECT * FROM pets INNER JOIN pet_img ON pets.pet_id = pet_img.pet_id WHERE pets.pet_id = ?;",
		req.params["id"],
		(err, pets) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(pets[0]);
			}
		}
	);
}

module.exports = {
	logIn,
	signUp,
	manageProfile,
	addPost,
	communityList,
	adoptionRequest,
	getpetPreview,
};
