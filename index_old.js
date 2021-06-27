const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
var cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "lunchbox",
});

app.use(fileUpload());
app.use(cors());
app.use(express.json());

app.post("/upload/:name", (req, res) => {
  const name = req.params.name;
  console.log("name = ");
  console.log(name);
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  console.log(file);
  file.mv(`${__dirname}/images/${name}.jpg`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${name}` });
  });
});

app.get("/getingredients", (req, res) => {
  db.query("SELECT * FROM ingredients_tb", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// ดึงวัตถุดิบ
app.get("/getingredients/:type_id", (req, res) => {
  const type_id = req.params.type_id;
  db.query(
    "SELECT * FROM ingredients_tb WHERE type_id = " + type_id,
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// ดึงเฉพาะวัตถุดิบ
app.get("/ingredients/:id_ingredient", (req, res) => {
  const id_ingredient = req.params.id_ingredient;
  console.log(
    "SELECT * FROM ingredients_tb WHERE id_ingredient = " + id_ingredient
  );
  db.query(
    "SELECT * FROM ingredients_tb WHERE id_ingredient = " + id_ingredient,
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// ดึงชนิดวัตถุดิบ
app.get("/gettypeingredients", (req, res) => {
  db.query(
    "SELECT type,type_id FROM ingredients_tb GROUP BY type ORDER BY type_id ASC",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/gethighlightingredients", (req, res) => {
  db.query(
    "SELECT * FROM ingredients_tb ORDER BY count ASC",
    function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/getfoods", (req, res) => {
  db.query("SELECT * FROM food_tb", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getfoodsedit/:id_food", (req, res) => {
  const id_food = req.params.id_food;
  db.query("SELECT * FROM food_tb WHERE id_food = "+id_food, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/login", (req, res) => {
  db.query("SELECT * FROM users_tb", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/getalldata", (req, res) => {
  db.query("SELECT * FROM `food_tb`", function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.post("/registeruser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phonenumber = req.body.phonenumber;
  console.log(email);
  console.log(password);
  console.log(firstname);
  console.log(lastname);
  console.log(phonenumber);
  db.query(
    "INSERT INTO users_tb (email, password, firtname, lastname, phonenumber) VALUES (?,?,?,?,?)",
    [email, password, firstname, lastname, phonenumber],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
        console.log("Insert Successfully");
      }
    }
  );
});

/*
id_user": 2,
"email": "kompanuwat@gmail.com",
"password": "12345678",
"firtname": "kom",
"lastname": "kawila",
"phonenumber": "0620243887",
"status": 1,
"address": "",
"namestore": "",
"typeStore": "",
"food": "",
"addressStore": "",
"gender": ""
*/
app.post("/registerstore", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phonenumber = req.body.phonenumber;
  const address = req.body.address;
  const namestore = req.body.namestore;
  const typeStore = req.body.typeStore;
  const food = req.body.food;
  const addressStore = req.body.addressStore;
  const gender = req.body.gender;
  const status = req.body.status;
  console.log(email);
  console.log(password);
  console.log(firstname);
  console.log(lastname);
  console.log(phonenumber);
  console.log(address);
  console.log(namestore);
  console.log(typeStore);
  console.log(food);
  console.log(addressStore);
  console.log(gender);
  console.log(status);
  db.query(
    "INSERT INTO users_tb (email, password, firtname, lastname, phonenumber, address, namestore, typeStore, food, addressStore, gender, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      email,
      password,
      firstname,
      lastname,
      phonenumber,
      address,
      namestore,
      typeStore,
      food,
      addressStore,
      gender,
      status,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
        console.log("Insert Successfully");
      }
    }
  );
});

app.post("/insertfood", (req, res) => {
  const value = req.body.value;
  const titlethai = req.body.titlethai;
  const titleeng = req.body.titleeng;
  const descrition = req.body.descrition;
  const store_id = req.body.store_id;
  const url = "uploads/foods/" + titleeng + ".png";
  db.query(
    "INSERT INTO food_tb (store_id, name_thai, name_eng, url, descrition) VALUES (?, ?, ?, ?, ?)",
    [store_id, titlethai, titleeng, url, descrition],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
        console.log("Insert Successfully");
        console.log(result);
        sqlfull = "";
        value.map((val) => {
          console.log(result.insertId);
          console.log(val.type);
          console.log(val.name);
          console.log(val.unit);
          const sql =
            "INSERT INTO fooddetail_tb (food_id, id_ingredient, ingredient_value,type) VALUES (" +
            parseInt(result.insertId) +
            "," +
            parseInt(val.id_ingredient) +
            "," +
            parseInt(val.unit)+ 
            "," +
            parseInt(val.type)+
            ");";
          sqlfull += sql;
          db.query(sql, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Insert Successfully");
              console.log(result);
            }
          });
          // **
        });
      }
    }
  );
});

app.get("/getfoods/:store_id", (req, res) => {
  const store_id = req.params.store_id;
  db.query("SELECT * FROM food_tb WHERE store_id = " + store_id, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getuser/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  db.query("SELECT * FROM users_tb WHERE id_user = " + id_user, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/updateuser/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const tel = req.body.tel;
  const gender = req.body.gender;
  const address = req.body.address;
  const addressStore = req.body.addressStore;
  const namestore = req.body.namestore;
  const typeStore = req.body.typeStore;
  const foodstore = req.body.foodstore;
  const email = req.body.email;
  db.query("UPDATE users_tb SET email=?,firtname=?, lastname=?,phonenumber=?,\
  address=?,namestore=?,typeStore=?, food=?,addressStore=?,gender=? WHERE id_user = ?", [email, firstname, lastname, tel, address, namestore, typeStore, foodstore, addressStore, gender, id_user], function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });

})

app.put("/updatepassword/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  const password = req.body.password;
  const sqlquery = "UPDATE users_tb SET password = " + password + " WHERE id_user = " + id_user;
  console.log("updatepassword");
  console.log(sqlquery);
  db.query("UPDATE users_tb SET password = ? WHERE id_user = ? ", [password, id_user], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
})

app.delete("/deletefoods/:id_food", (req, res) => {
  const id_food = req.params.id_food;
  console.log("deletefoods");
  db.query("DELETE FROM food_tb WHERE id_food = ?", [id_food], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // res.send(result);
    }
  });
  db.query("DELETE FROM fooddetail_tb WHERE food_id = ?", [id_food], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getfoodsforedit/:food_id", (req, res) => {
  const food_id = req.params.food_id;
  db.query("SELECT * FROM fooddetail_tb,food_tb WHERE food_id = " + food_id, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getfoodsforedits/:food_id", (req, res) => {
  const food_id = req.params.food_id;
  db.query("SELECT * FROM fooddetail_tb WHERE food_id = " + food_id, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/getdetialfood/:id_ingredient", (req, res) => {
  const id_ingredient = req.params.ingredients_tb;
  db.query("SELECT * FROM `ingredients_tb` WHERE `id_ingredient` = " + id_ingredient, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.use(express.static('public'));  
app.use('/images', express.static('images')); 

app.listen(3001, () => console.log("Server Started..."));
