const db = require("../sql/mysql");
const bcrypt = require("bcryptjs");
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
			return res.json({ auth: false, message: "Invalid Email or Password" });
		db.query(password_check, [req.body.email], async (err, result_pass) => {
			const result = await bcrypt.compare(
				req.body.password,
				result_pass[0].pass
			);
			if (err) throw err;
			if (result) {
				const email = isThereAcc[0].email;
				const token = jwt.sign(email, process.env.JWT_SECRET);
				return res
					.header("Authorization", token)
					.json({ token: token, userData: isThereAcc[0] });
			} else {
				return res.json({ message: "Invalid Email or Password" });
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
	const email = jwt.verify(req.body.token, process.env.JWT_SECRET);
	const accInfo = `SELECT * FROM accounts WHERE email = ?`;
	let taken = 0;
	const updates = [];
	const values = [];

	if (req.body.newEmail && req.body.newEmail !== req.body.prevEmail) {
		await new Promise((resolve, reject) => {
			db.query(accInfo, [req.body.newEmail], (err, result) => {
				if (err) return reject(err);
				if (result.length > 0) taken = 1;
				resolve();
			});
		});
		if (taken === 1) return res.json({ message: "Email Taken", access: 0 });
		updates.push("email = ?");
		values.push(req.body.newEmail);
	}

	if (req.body.fname) {
		updates.push("fname = ?");
		values.push(req.body.fname);
	}

	if (req.body.lname) {
		updates.push("lname = ?");
		values.push(req.body.lname);
	}

	if (req.body.image) {
		updates.push("image = ?");
		values.push(req.body.image);
	}

	if (req.body.pass) {
		const hashedPassword = await bcrypt.hash(req.body.pass, 10);
		updates.push("pass = ?");
		values.push(hashedPassword);
	}

	if (updates.length === 0) {
		return res.json({ message: "No changes made", access: 0 });
	}

	const sql = `UPDATE accounts SET ${updates.join(", ")} WHERE email = ?`;
	values.push(req.body.prevEmail);

	db.query(sql, values, (err, result) => {
		if (err) return console.log(err);

		const finalEmail = req.body.newEmail || req.body.prevEmail;
		db.query(accInfo, [finalEmail], (err, info) => {
			if (err) return console.log(err);
			const newToken = jwt.sign(email, process.env.JWT_SECRET);

			return res.json({
				userData: info[0],
				token: newToken,
				message: "Info Updated Successfully",
				access: 1,
			});
		});
	});
}

async function addPost(req, res) {
	const addpost =
		"INSERT into community(postNumber, user_name, user_img, description, dates, image, timePosted) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const sql = "SELECT * from community";
	const token = jwt.verify(req.headers.token, process.env.JWT_SECRET);
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
