const db = require('../mysql');

async function getPets(req, res) {
    db.query("select * from pets where status = 'Available' || status = 'Pending'", (err, petList) => {
        if(err){
            console.log(err);
        }
        else{
            return res.json(petList);
        }
    });
}

async function getCats(req, res) {
    db.query("select * from pets where category = 'cats' && status = 'Available'", (err, catList) => {
        if(err){
            console.log(err);
        }
        else{
            return res.json(catList);
        }
    });
}

async function getDogs(req, res) {
    db.query("select * from pets where category = 'dogs' && status = 'Available'", (err, dogList) => {
        if(err){
            console.log(err);
        }
        else{
            return res.json(dogList);
        }
    });
}

module.exports = {
    getPets,
    getDogs,
    getCats,
};