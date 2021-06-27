const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const fs = require('fs')

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
try {
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
  
  app.get("/getfoods", (req, res) => {
    db.query("SELECT * FROM `food_tb`", function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  // app.get("/getfoods", (req, res) => {
  //   db.query("SELECT * FROM `food_tb`", function (err, result, fields) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send(result);
  //       console.log(result);
  //     }
  //   });
  // });
  
  app.get("/getstores", (req, res) => {
    db.query("SELECT * FROM users_tb WHERE status = 1", function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.get("/getfoods/:id_food", (req, res) => {
    const id_food = req.params.id_food;
    db.query("SELECT * FROM `food_tb` WHERE id_food = " + id_food, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.get("/getfoodsusers/:store_id", (req, res) => {
    const store_id = req.params.store_id;
    db.query("SELECT * FROM `food_tb` WHERE store_id = " + store_id, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
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
  
  app.get("/getingredients/:id_ingredient", (req, res) => {
    const id_ingredient = req.params.id_ingredient;
    db.query("SELECT * FROM ingredients_tb WHERE id_ingredient = " + id_ingredient, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  
  app.get("/gettypeingredients/:type_id", (req, res) => {
    const type_id = req.params.type_id;
    db.query("SELECT * FROM ingredients_tb WHERE type_id = " + type_id, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  
  app.get("/getingredientsfoods/:id_food", (req, res) => {
    const id_food = req.params.id_food;
    db.query("SELECT * FROM fooddetail_tb WHERE food_id = " + id_food, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  
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
  
    try {
      const pathdelete = __dirname + "/images/" + id_food + ".jpg";
  
      fs.unlinkSync(pathdelete);
      //file removed
    } catch (err) {
      console.error(err)
    }
  });
  
  app.get("/getunit-ingredients", (req, res) => {
    db.query("SELECT unit_food FROM ingredients_tb GROUP BY unit_food", function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.get("/gettype", (req, res) => {
    db.query("SELECT type_id,type FROM ingredients_tb group by type", function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  let name_thais = "";
  let unit_food = "";
  app.post("/insertfood", (req, res) => {
    const store_id = req.body.store_id;
    const name_thai = req.body.name_thai;
    const price = req.body.price;
    const energy = req.body.energy;
    const protein = req.body.protein;
    const fat = req.body.fat;
    const carbohydrate = req.body.carbohydrate;
    const objects = req.body.objects;
    const descrition = req.body.descrition;
  
    var arraynew1 = [];
    var arraynew2 = [];
    var array_food_id = [];
    var array_id_ingredient = [];
    var array_ingredient_value = [];
    var array_price_value = [];
    var array_obj = [];
    var idfood = 0;
    db.query(
      "INSERT INTO food_tb (store_id, name_thai, price, energy, protein, fat, carbohydrate,descrition) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
      [store_id, name_thai, price, energy, protein, fat, carbohydrate, descrition],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // res.send("Values inserted");
          console.log("Insert Successfully");
          sqlfull = "";
          objects.map((val) => {
            idfood = result.insertId;
            function a() {
              console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
              db.query("SELECT * FROM ingredients_tb WHERE id_ingredient = " + val.ingredient, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  result.map((dataSelect) => {
                    console.log("Select Successfully");
                    name_thais = dataSelect.name_thai;
                    unit_food = dataSelect.unit_food;
                    arraynew1.push(name_thais);
                    arraynew2.push(unit_food);
                    array_food_id.push(idfood);
                    array_id_ingredient.push(val.ingredient);
                    array_ingredient_value.push(val.units);
                    array_price_value.push(val.price);
                  });
                }
              });
            }
  
            function b(name_thais1, unit_food1) {
              console.log("BBBBBBBBBBBBBBBBBBBBBBBB");
              const sql =
                "INSERT INTO fooddetail_tb (food_id, id_ingredient, ingredient_value,name_thai,unit,price) VALUES (" +
                parseInt(result.insertId) +
                "," +
                parseInt(val.ingredient) +
                "," +
                parseInt(val.units) +
                "," +
                "\'" + name_thais1 + "\'" +
                "," +
                "\'" + unit_food1 + "\'" +
                ");";
              sqlfull += sql;
              db.query(sql, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Insert Successfully");
                  console.log(result);
                  // res.send("Values inserted");
                }
              });
            }
            a();
  
          });
          const sqlupdate = "UPDATE food_tb SET url=\'" + result.insertId + ".jpg\' WHERE id_food = " + result.insertId;
          db.query(sqlupdate, (err, result) => {
            if (err) {
              console.log(err);
              console.log("Update URL Error !!!!!!!!!!");
            } else {
              console.log("Update URL Successfully");
              res.send(String(idfood));
            }
          });
          setTimeout(() => {
            console.log("arraynew1 = " + arraynew1);
            console.log("arraynew2 = " + arraynew2);
            console.log("array_food_id = " + array_food_id);
            console.log("array_id_ingredient = " + array_id_ingredient);
            console.log("array_ingredient_value = " + array_ingredient_value);
            console.log("array_price_value = " + array_price_value);
  
            for (i = 0; i < arraynew1.length; i++) {
              array_obj.push({
                arraynew1: arraynew1[i],
                arraynew2: arraynew2[i],
                array_food_id: array_food_id[i],
                array_id_ingredient: array_id_ingredient[i],
                array_ingredient_value: array_ingredient_value[i],
                array_price_value: array_price_value[i]
              });
            }
  
            array_obj.map((res) => {
              console.log(res);
              const sql =
                "INSERT INTO fooddetail_tb (food_id, id_ingredient, ingredient_value,name_thai,unit,price) VALUES (" +
                parseInt(res.array_food_id) +
                "," +
                parseInt(res.array_id_ingredient) +
                "," +
                parseInt(res.array_ingredient_value) +
                "," +
                "\'" + res.arraynew1 + "\'" +
                "," +
                "\'" + res.arraynew2 + "\'" +
                "," +
                "\'" + res.array_price_value+ "\'" +
                ");";
  
                
              console.log("sql = " + sql);
              sqlfull += sql;
              db.query(sql, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Insert Successfully");
                  console.log(result);
                  // res.send("Vnalues inserted");
                }
              });
            }); // end map
          }, 2000);
        }
      }
    );
  });
  
  // **************************************************************************************
  
  let name_thais2 = "";
  let unit_food2 = "";
  app.post("/updatefood", (req, res) => {
    const store_id = req.body.store_id;
    const name_thai = req.body.name_thai;
    const price = req.body.price;
    const energy = req.body.energy;
    const protein = req.body.protein;
    const fat = req.body.fat;
    const carbohydrate = req.body.carbohydrate;
    const objects = req.body.objects;
    const descrition = req.body.descrition;
    const id_food = req.body.id_food;
  
    var arraynew1 = [];
    var arraynew2 = [];
    var array_food_id = [];
    var array_id_ingredient = [];
    var array_ingredient_value = [];
    var array_price_value = [];
    var array_obj = [];
    var idfood = 0;
    db.query(
      "UPDATE food_tb SET store_id = ?, name_thai = ?, price = ?, energy = ?, protein = ?, fat = ?, carbohydrate = ?,descrition = ? WHERE id_food = ?",
      [store_id, name_thai, price, energy, protein, fat, carbohydrate, descrition,id_food],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // res.send("Values inserted");
          console.log("Insert Successfully");
          sqlfull = "";
          objects.map((val) => {
            idfood = result.insertId;
            function a() {
              console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
              db.query("SELECT * FROM ingredients_tb WHERE id_ingredient = " + val.ingredient, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  result.map((dataSelect) => {
                    console.log("Select Successfully");
                    name_thais2 = dataSelect.name_thai;
                    unit_food2 = dataSelect.unit_food;
                    arraynew1.push(name_thais2);
                    arraynew2.push(unit_food2);
                    array_food_id.push(idfood);
                    array_id_ingredient.push(val.ingredient);
                    array_ingredient_value.push(val.units);
                    array_price_value.push(val.price);
                  });
                }
              });
            }
            a();
  
          });
          const sqlupdate = "UPDATE food_tb SET url=\'" + result.insertId + ".jpg\' WHERE id_food = " + result.insertId;
          db.query(sqlupdate, (err, result) => {
            if (err) {
              console.log(err);
              console.log("Update URL Error !!!!!!!!!!");
            } else {
              console.log("Update URL Successfully");
              res.send(String(idfood));
            }
          });
          setTimeout(() => {
            console.log("arraynew1 = " + arraynew1);
            console.log("arraynew2 = " + arraynew2);
            console.log("array_food_id = " + array_food_id);
            console.log("array_id_ingredient = " + array_id_ingredient);
            console.log("array_ingredient_value = " + array_ingredient_value);
            console.log("array_price_value = " + array_price_value);
  
            for (i = 0; i < arraynew1.length; i++) {
              array_obj.push({
                arraynew1: arraynew1[i],
                arraynew2: arraynew2[i],
                array_food_id: array_food_id[i],
                array_id_ingredient: array_id_ingredient[i],
                array_ingredient_value: array_ingredient_value[i],
                array_price_value: array_price_value[i]
              });
            }
  
            db.query("DELETE FROM fooddetail_tb WHERE food_id = " + id_food , (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log("DELETE Successfully");
                console.log(result);
                // res.send("Vnalues inserted");
              }
            });
            array_obj.map((res) => {
              console.log(res);
              const sql =
                "INSERT INTO fooddetail_tb (food_id, id_ingredient, ingredient_value,name_thai,unit,price) VALUES (" +
                parseInt(id_food) +
                "," +
                parseInt(res.array_id_ingredient) +
                "," +
                parseInt(res.array_ingredient_value) +
                "," +
                "\'" + res.arraynew1 + "\'" +
                "," +
                "\'" + res.arraynew2 + "\'" +
                "," +
                "\'" + res.array_price_value+ "\'" +
                ");";
  
                
              console.log("sql = " + sql);
              sqlfull += sql;
              db.query(sql, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Insert Successfully");
                  console.log(result);
                  // res.send("Vnalues inserted");
                }
              });
            }); // end map
          }, 2000);
        }
      }
    );
  });
  
  // **************************************************************************************
  app.post("/addingredients", (req, res) => {
    const name_thai = req.body.name_thai;
    const type_id = req.body.type_id;
    const unit_food = req.body.unit_food; // g
    const energy = req.body.energy;
    const protein = req.body.protein;
    const fat = req.body.fat;
    const carbohydrate = req.body.carbohydrate;
    console.log("addingredients !!!!!!!!!!!!!!!!!!!!!!!!!!!");
    var type = "";
    if (type_id == 1) {
      type = "ธัญพืช";
    }else if (type_id == 2) {
      type = "หัว/ราก";
    }else if (type_id == 3) {
      type = "ถั่ว";
    }else if (type_id == 4) {
      type = "ผัก";
    }else if (type_id == 5) {
      type = "ผลไม้ ";
    }else if (type_id == 6) {
      type = "เนื้อ";
    }else if (type_id == 7) {
      type = "ปลา";
    }else if (type_id == 8) {
      type = "ไข่";
    }else if (type_id == 9) {
      type = "นม";
    }else if (type_id == 10) {
      type = "เครื่องเทศ";
    }else if (type_id == 11) {
      type = "อาหารปรุงสุก";
    }else if (type_id == 12) {
      type = "ของหวาน";
    }else if (type_id == 13) {
      type = "แมลง";
    }else if (type_id == 14) {
      type = "อื่น ๆ ";
    }else if (type_id == 15) {
      type = "ส่วนผสมอาหารคลีน";
    }
    const sql =
      "INSERT INTO ingredients_tb(name_thai, type_id, unit_food, energy, protein, fat, carbohydrate, type) VALUES (\'" +
      name_thai + "\'" +
      "," +
      type_id +
      ",\'" +
      unit_food + "\'" +
      "," + energy +
      "," + protein +
      "," + fat +
      "," + carbohydrate +
      ",\'" + type + "\'" +
      ");";
  
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Insert Successfully");
        console.log(result);
        res.send("Values inserted");
      }
    });
  });
  
  app.get("/login/:uid", (req, res) => {
    const uid = req.params.uid;
    console.log("uid = ");
    console.log(uid);
    db.query("SELECT * FROM `users_tb` WHERE uid = \'" + uid + "\'", function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send("[]");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.post("/regisstore", (req, res) => {
    const uid = req.body.uid;
    const email = req.body.email;
    const name = req.body.name;
    const phonenumber = req.body.phonenumber;
    const status = req.body.status;
    const address = req.body.address;
    const namestore = req.body.namestore;
    const typeStore = req.body.typeStore;
    const food = req.body.food;
    const addressStore = req.body.addressStore;
    const gender = req.body.gender;
    console.log("uid = ");
    console.log(uid);
    db.query("INSERT INTO users_tb(uid, email, name, phonenumber, status, address, namestore, typeStore, food, addressStore, gender) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [uid,email,name,phonenumber,status,address,namestore,typeStore,food,addressStore,gender], function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send("[]");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.post("/regisadmin", (req, res) => {
    const uid = req.body.uid;
    const email = req.body.email;
    const name = req.body.name;
    const phonenumber = req.body.phonenumber;
    const status = req.body.status;
    const address = req.body.address;
    const gender = req.body.gender;
    console.log("uid = ");
    console.log(uid);
    console.log("gender = ");
    console.log(gender);
    db.query("INSERT INTO users_tb(uid, email, name, phonenumber, status, address, gender) VALUES (?,?,?,?,?,?,?)",
    [uid,email,name,phonenumber,status,address,gender], function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send("[]");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  app.post("/editadmin", (req, res) => {
    const uid = req.body.uid;
    const phonenumber = req.body.phonenumber;
    const address = req.body.address;
    const gender = req.body.gender;
    console.log("uid = ");
    console.log(uid);
    console.log("gender = ");
    console.log(gender);
  
    db.query("UPDATE users_tb SET phonenumber=?,address=?,gender=? WHERE uid=?",
    [phonenumber,address,gender,uid], function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send("[]");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
  
  
  app.post("/editstore", (req, res) => {
    const uid = req.body.uid;
    const phonenumber = req.body.phonenumber;
    const address = req.body.address;
    const gender = req.body.gender;
    const namestore = req.body.namestore;
    const typeStore = req.body.typeStore;
    const food = req.body.food;
    const addressStore = req.body.addressStore;
    console.log("uid = ");
    console.log(uid);
    console.log("gender = ");
    console.log(gender);
  
    db.query("UPDATE users_tb SET phonenumber=?,address=?,gender=?,namestore=?,typeStore=?,food=?,addressStore=? WHERE uid=?",
    [phonenumber,address,gender,namestore,typeStore,food,addressStore,uid], function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send("[]");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });
}
catch{

}


app.use(express.static('public'));
app.use('/images', express.static('images'));

app.listen(3001, () => console.log("Server Started..."));
