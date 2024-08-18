const db = require("../mysql");

async function adminPetList(req, res) {
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
}

module.exports = { adminPetList };
