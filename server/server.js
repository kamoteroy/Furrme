require("dotenv").config();
const express = require("express");
const db = require("./mysql");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const cloud = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const saltRounds = 10; // Change 'salt' to 'saltRounds'
const app = express();
const page = require("./controllers/pageController");
const user = require("./controllers/userController");
const admin = require("./controllers/pageController");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

cloud.config({
  api_key: process.env.api_key,
  cloud_name: process.env.cloud_name,
  api_secret: process.env.api_secret,
});

const verifyJWT = (req, res, next) => {
  var token;
  token = req.headers.token;
  if (!token) {
    token = req.body.token;
  }
  try {
    const validToken = jwt.verify(token, "jwtRoy");
    if (validToken) {
      next();
    }
  } catch (err) {
    res.json({ auth: false, message: "No Access" });
  }
};

app.get("/pets", page.getPets);
app.get("/pets/cats", page.getCats);
app.get("/pets/dogs", page.getDogs);

app.post("/login", user.logIn);
app.post("/signup", user.signUp);
app.post("/manage", verifyJWT, user.manageProfile);
app.post("/addpost", verifyJWT, user.addPost);
app.get("/community", user.communityList);

app.get("/petDetails/:id", async (req, res) => {
  db.query(
    "select * from pets where pet_id = ?",
    req.params["id"],
    (err, pets) => {
      if (err) {
        console.log(err);
      } else {
        return res.json(pets[0]);
      }
    }
  );
});

app.get("/petImage/:id", async (req, res) => {
  db.query(
    "select img1,img2,img3,img4,img5 from pet_img where pet_id = ?",
    req.params["id"],
    (err, pets) => {
      if (err) {
        console.log(err);
      } else {
        return res.json(pets[0]);
      }
    }
  );
});

app.post("/upload", async (req, res, next) => {
  const image_url = req.body.image_url;
  try {
    const uploadResult = await cloud.uploader
      .upload(image_url)
      .then((result) => {
        return res.json(result.secure_url);
      });
  } catch (error) {
    console.log(error);
  }
});

app.post("/admin/preview", (req, res) => {
  db.query(
    "select * from accounts where email = ?",
    [req.body.email],
    (err, accInfo) => {
      if (err) {
        console.log(err);
      } else {
        return res.json(accInfo[0]);
      }
    }
  );
});

app.post("/adoptreq", async (req, res) => {
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
});

app.post("/admin/create", async (req, res) => {
  const email = "update from * from accounts where email = ?";

  db.query(email, [req.body.email], (err, result_email) => {
    if (!result_email[0]) return res.json({ Status: "No Email Found!" });
    db.query(password, [req.body.email], async (err, result_pass) => {
      if (err) throw err;
      if (req.body.password === result_pass[0].pass) {
        res.json(result_email[0]);
      } else {
        return res.json({ Status: "Incorrect Password!" });
      }
    });
  });
});

app.get("/admin", (req, res) => {
  db.query(
    "select * from pets inner join pet_img on pets.pet_id = pet_img.pet_id",
    (err, petList) => {
      if (err) {
        console.log(err);
      } else {
        return res.json(petList);
      }
    }
  );
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

app.post("/admin/evaluation/acc", (req, res) => {
  db.query(
    "select * from accounts where email = ?",
    [req.body.email],
    (err, accInfo) => {
      if (err) {
        console.log(err);
      }
      return res.json(accInfo);
    }
  );
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

app.get("/requestlist", (req, res) => {
  db.query("select * from adoptreq", (err, petList) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(petList);
    }
  });
});

app.post("/petpreview/:name", (req, res) => {
  db.query(
    "select * from pet_img where pet_id = ?",
    [req.body.petID],
    (err, pets) => {
      if (err) {
        console.log(err);
      } else {
        return res.json(pets[0]);
      }
    }
  );
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database");
});

//testing
app.listen(3001, () => {
  console.log("Running on port 3001...");
});
