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

app.use(cors());
app.use(cookieParser());
// Increase the limit to accommodate large payloads
app.use(bodyParser.json({ limit: "50mb" })); // For JSON payloads
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // For URL-encoded payloads

// Alternatively, with Express 4.16+:
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database");
});

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

app.get("/admin", verifyJWT, admin.adminPetList);
app.get("/admin/petDetails/:id", verifyJWT, admin.getpetDetails);
app.get("/admin/petImage/:id", verifyJWT, admin.getpetImages);
app.post("/admin/petInfoUpdate", verifyJWT, admin.updatePetInfo);

app.get("/adoption/list", verifyJWT, admin.adoptionList);
app.post("/admin/evaluation/accDetails", verifyJWT, admin.accDetails);

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
