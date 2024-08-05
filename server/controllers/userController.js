const db = require('../mysql');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const cloud = require('cloudinary').v2;

cloud.config({
    api_key: process.env.api_key,
    cloud_name: process.env.cloud_name,
    api_secret: process.env.api_secret,
});

async function logIn(req, res) {
    const email_check = "select * from accounts where email = ?";
    const password_check = "select pass from accounts where email = ?"

    db.query(email_check, [req.body.email], (err, isThereAcc) => {
        if (!isThereAcc[0]) return res.json({ auth: false, message: "No Email Found!" });
        db.query(password_check, [req.body.email], async (err, result_pass) => {
            const result = await bcrypt.compare(req.body.password, result_pass[0].pass)
            if (err) throw err;
            if (result) {
                const email = isThereAcc[0].email
                const token = jwt.sign(email, "jwtRoy")
                return(res
                    .header("Authorization", token)
                    .json({token: token, userData: isThereAcc[0]})
            )
            }
            else {
                return res.json({ message: "Incorrect Password!" })
            }
        });
    });
}

async function signUp(req, res) {
    const sql = "INSERT into accounts(fname, lname, email, pass, image) VALUES (?, ?, ?, ?, ?)";
    const emailQuery = "select email from accounts where email = ?";

    db.query(emailQuery, [req.body.email], async (err, result_email) => {
        if (!result_email[0]){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            db.query(sql, [req.body.fname, req.body.lname, req.body.email, hashedPassword, req.body.image], (err, results) => {
                if (err) return res.json({ message: "Error Inserting data in server" });
                return res.json({ message: "Success" });
            });
        }
        else {return res.json({ message: "Email already used" })};
    });
}

async function manageProfile(req, res) {
    const updateInfo = "UPDATE accounts set fname = ?, lname = ?, email = ?, pass = ?, image = ? where email = ?";
    const accInfo = "select fname,image,lname,email from accounts where email = ?";
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);

    const email = jwt.verify(req.body.token, 'jwtRoy')
    if(email===req.body.email){
        db.query(updateInfo, [req.body.fname, req.body.lname , email, hashedPassword, req.body.image, req.body.prevEmail], (err, result) => {
            if(err) console.log(err);
            else{
                db.query(accInfo, [email], (err, info) => {
                    if(err) console.log(err);
                    else return res.json({userData: info[0], token: req.body.token, message: 'Info Updated Successfully'});
                });
            }
        });
    }
    else{
        res.json({message: 'No fcking Access'})
    }
}

async function addPost(req, res) {
    const addpost = "INSERT into community(user_name, user_img, description, dates, image) VALUES (?, ?, ?, ?, ?)";
    const sql = "SELECT * from community"
    token = jwt.verify(req.body.token, 'jwtRoy')
    if(token){
        db.query(addpost, [req.body.user_name, req.body.user_img ,req.body.description, req.body.date, req.body.image], (err, result) => {
            if(err) console.log(err);
            db.query(sql, (err, postList) => {
                if(err) console.log(err);
                return res.json(postList);
            });
        });
    }
    else{
        res.json({message: 'No fcking Access'})
    }



    
}

async function communityList(req, res) {
    db.query("select * from community ORDER BY dates desc;", (err, postList) => {
        if(err){
            console.log(err);
        }
        else{
            return res.json(postList);
        }
    });
}

module.exports = {
    logIn,
    signUp,
    manageProfile,
    addPost,
    communityList,
};