const express = require("express");
const app = express();
const path = require("path");
const mogodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const connectionURL = "mongodb://localhost:27017/mydb";
var dbo;

app.use(express.static("public/"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));
app.use(express.urlencoded({ extended: true }));



//connects to DB and creates collection Cart
MongoClient.connect(connectionURL, function (error, database) {
  if (error) throw error;
  dbo = database.db("mydb");

  dbo.createCollection("cart", function (err, res) {
    if (err) {
      if (err.ok == 0) {
        console.log("Collection cart already exist...");
        return;
      }
      throw err;
    }
    console.log("Collection cart have been created!");
  });
});

//connects to DB and creates collection Instruments
MongoClient.connect(connectionURL, function (error, database) {
  if (error) throw error;
  dbo = database.db("mydb");

  dbo.createCollection("instruments", function (err, res) {
    if (err) { 
      if (err.ok == 0) {  //checks if the collection is already created
        console.log("Collection instruments already exist...");
        return;
      }
      throw err;
    }
    //array of documents to be inserted into the DB
    const myProductsObj = [
      {
        name: "Ibanez",
        price: 800,
        type: "guitar",
        stock: 0,
        image: "images/ibanez800.jpg",
        imageout: "images/ibanez800out.jpg",
      },
      {
        name: "Les Paul",
        price: 1000,
        type: "guitar",
        stock: 3,
        image: "images/lespaul800.jpg",
        imageout: "images/lespaul800out.jpg",
      },
      {
        name: "PRS",
        price: 1200,
        type: "guitar",
        stock: 1,
        image: "images/prs800.jpg",
        imageout: "images/prs800out.jpg",
      },
      {
        name: "Stratocaster",
        price: 600,
        type: "guitar",
        stock: 5,
        image: "images/strat800.jpg",
        imageout: "images/strat800out.jpg",
      },
      {
        name: "Precision",
        price: 700,
        type: "bass",
        stock: 6,
        image: "images/bass1.jpg",
        imageout: "images/bass1out.jpg",
      },
      {
        name: "Fender",
        price: 500,
        type: "bass",
        stock: 2,
        image: "images/bass2.jpg",
        imageout: "images/bass2out.jpg",
      },
      {
        name: "Yamaha",
        price: 600,
        type: "bass",
        stock: 4,
        image: "images/bass3.jfif",
        imageout: "images/bass3out.jpg",
      },
      {
        name: "Ibanez bass",
        price: 800,
        type: "bass",
        stock: 7,
        image: "images/bass4.jfif",
        imageout: "images/bass4out.jpg",
      },
      {
        name: "Ludwig",
        price: 600,
        type: "drums",
        stock: 5,
        image: "images/drums1.jpg",
        imageout: "images/drums1out.jpg",
      },
      {
        name: "Golden",
        price: 700,
        type: "drums",
        stock: 5,
        image: "images/drums2.jfif",
        imageout: "images/drums2out.jpg",
      },
      {
        name: "Q7 Drums",
        price: 900,
        type: "drums",
        stock: 2,
        image: "images/drums3.jpg",
        imageout: "images/drums3out.jpg",
      },
      {
        name: "Beginners",
        price: 300,
        type: "drums",
        stock: 10,
        image: "images/drums4.jpg",
        imageout: "images/drums4out.jpg",
      },
      {
        name: "Casio",
        price: 500,
        type: "keyboard",
        stock: 6,
        image: "images/keyboard1.jfif",
        imageout: "images/keyboard1out.jpg",
      },
      {
        name: "Casio Pro",
        price: 700,
        type: "keyboard",
        stock: 3,
        image: "images/keyboard2.jfif",
        imageout: "images/keyboard2out.jpg",
      },
      {
        name: "PSR-360",
        price: 1000,
        type: "keyboard",
        stock: 1,
        image: "images/keyboard3.jfif",
        imageout: "images/keyboard3out.jpg",
      },
      {
        name: "P400D",
        price: 900,
        type: "keyboard",
        stock: 2,
        image: "images/keyboard4.jfif",
        imageout: "images/keyboard4out.jpg",
      },
    ];
    dbo
      .collection("instruments")
      .insertMany(myProductsObj, function (err, results) {
        if (err) throw err;
      });
    console.log("Collection instruments have been created!");
  });
  console.log("Connected successfully to the MongoDB Community server.....");
});

//loads the signin page which is the first thing displayed 
app.get("/", function (req, res) {
  res.render("signin");
});
//lods signin page used in case the user didn't signin
app.get("/signin", function (req, res) {
  res.render("signin");
});
//loads the "home" page
app.get("/index", function (req, res) {
  let instrumentDisplay = [];
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    dbo
      .collection("instruments")
      .findOne({ type: "guitar" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          instrumentDisplay.push(result);
        }
      });
    dbo
      .collection("instruments")
      .findOne({ type: "bass" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          instrumentDisplay.push(result);
        }
      });
    dbo
      .collection("instruments")
      .findOne({ type: "drums" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          instrumentDisplay.push(result);
        }
      });
    dbo
      .collection("instruments")
      .findOne({ type: "keyboard" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("error");
        } else {
          instrumentDisplay.push(result);
          console.log("rendering index ejs page");
          res.render("index", { obj: instrumentDisplay });
        }
      });
  });
});
//loads guitar page 
app.get("/guitars", function (req, res) {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //query that gets only guitars from collection instruments
    dbo
      .collection("instruments")
      .find({ type: "guitar" })
      .toArray(function (err, results) {
        if (err) throw err;
        if (!results) {
          console.log("no results...");
          return;
        }
        console.log("rendering the guitars ejs page");
        res.render("instruments", { obj: results, type: "Guitars" });
      });
  });
});
//loads bass page
app.get("/bass", function (req, res) {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //query that gets only guitars from collection instruments
    dbo
      .collection("instruments")
      .find({ type: "bass" })
      .toArray(function (err, results) {
        if (err) throw err;
        if (!results) {
          console.log("no results...");
          return;
        }
        console.log("rendering the bass ejs page");
        res.render("instruments", { obj: results, type: "Bass" });
      });
  });
});
//loads keyboard page
app.get("/keyboards", function (req, res) {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //query that gets only guitars from collection instruments
    dbo
      .collection("instruments")
      .find({ type: "keyboard" })
      .toArray(function (err, results) {
        if (err) throw err;
        if (!results) {
          console.log("no results...");
          return;
        }
        console.log("rendering the keyboards ejs page");
        res.render("instruments", { obj: results, type: "Keyboards" });
      });
  });
});
//loads topdeals page
app.get("/topDeals", function (req, res) {
  let topDeals = [];
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //query that gets only guitars from collection instruments
    dbo
      .collection("instruments")
      .findOne({ stock: { $gt: 0 }, type: "guitar" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          topDeals.push(result);
        }
      });
      //query that gets only bass from collection instruments
    dbo
      .collection("instruments")
      .findOne({ stock: { $gt: 0 }, type: "bass" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          topDeals.push(result);
        }
      });
      //query that gets only drums from collection instruments
    dbo
      .collection("instruments")
      .findOne({ stock: { $gt: 0 }, type: "drums" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else {
          topDeals.push(result);
        }
      });
      //query that gets only keyboard from collection instruments
    dbo
      .collection("instruments")
      .findOne({ stock: { $gt: 0 }, type: "keyboard" }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("rendering the top deals ejs page");
          res.render("topDeals", { obj: topDeals });
        } else {
          topDeals.push(result);
          console.log("rendering the top deals ejs page");
          res.render("instruments", { obj: topDeals, type: "Top Deals" });
        }
      });
  });
});
//loads drums page
app.get("/drums", function (req, res) {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //query that gets only drums from collection instruments
    dbo
      .collection("instruments")
      .find({ type: "drums" })
      .toArray(function (err, results) {
        if (err) throw err;
        if (!results) {
          console.log("no results...");
        }
        console.log("rendering the drums ejs page");
        res.render("instruments", { obj: results, type: "Drums" });
      });
  });
});
//queries cart items according to user id
app.post("/cart", function (req, res) {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
        //query that gets only items with ID from collection Cart
    dbo
      .collection("cart")
      .find({ userID: req.body.ID })
      .toArray(function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
          res.render("cart", { instruments: result });
        } else {
          console.log("rendering the cart ejs page");
          res.render("cart", { instruments: result });
        }
      });
  });
});
//called from add buttons, adds clicked item to the cart of the user
app.post("/addtocart", (req, res) => {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    var item;

    dbo
      .collection("instruments")
      .findOne({ name: req.body.name }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
        } else if (result.stock <= 0) {
          console.log("item not available");
          res.send(`item not in stock`);
        } else {
          item = result;
          item.userID = req.body.ID;
          //decrements stock when adding an item to cart
          dbo
            .collection("instruments")
            .findOneAndUpdate({ name: req.body.name }, { $inc: { stock: -1 } });
          //adds item to quantity with quantity 1
          dbo
            .collection("cart")
            .findOne(
              { name: result.name, userID: req.body.ID },
              function (err, result) {
                if (err) throw err;
                else if (!result) {
                  dbo
                    .collection("cart")
                    .insertOne(item, function (err, result) {
                      if (err) throw err;
                      dbo
                        .collection("cart")
                        .findOneAndUpdate(
                          { name: item.name },
                          { $inc: { quantity: 1 } }
                        );
                      console.log("item added to cart");
                      res.send(`success`);
                    });
                } else {
                  dbo
                    .collection("cart")
                    .findOneAndUpdate(
                      { name: item.name, userID: req.body.ID },
                      { $inc: { quantity: 1 } }
                    );
                  console.log("item added to cart");
                  res.send(`success`);
                }
              }
            );
        }
      });
  });
});
//called from add button in cart, increments quantity in cart while decrementing stock in instruments
app.post("/addQuantity", (req, res) => {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    let instrument;
    //gets item by name
    dbo
      .collection("instruments")
      .findOne({ name: req.body.name }, function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
          res.send(`failed`);
        } else if (result.stock <= 0) {
          res.send(`failed`);
        } else {
          itemQuantity = result.quantity;
          //decrements the stock of the item
          dbo
            .collection("instruments")
            .findOneAndUpdate({ name: req.body.name }, { $inc: { stock: -1 } });
          //adds more quantity to item in cart
          instrument = dbo
            .collection("cart")
            .findOneAndUpdate(
              { name: req.body.name, userID: req.body.ID },
              { $inc: { quantity: 1 } },
              { returnDocument: true }
            );
          console.log("item quantity incremented in cart");
          res.send(`success`);
        }
      });
  });
});
//called from sub button in cart, decrements quantity in cart while incrementing stock in instruments
app.post("/subQuantity", (req, res) => {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    //gets the item by item name and user id
    dbo
      .collection("cart")
      .findOne(
        { name: req.body.name, userID: req.body.ID },
        function (err, result) {
          if (err) throw err;
          else if (!result) {
            console.log("no results...");
            res.send(`failed`);
          } else if (result.quantity == 1) {//removes item if quantity is =1
            dbo
              .collection("cart")
              .findOneAndDelete({ name: result.name, userID: req.body.ID });
            console.log("item removed from cart");
            res.send(`success`);
          } else if (result.quantity <= 0) {//cannot remove amount if the quantity is 0
            res.send(`failed`);
          } else {
            //increments stock of the item in instruments
            dbo
              .collection("instruments")
              .findOneAndUpdate(
                { name: req.body.name },
                { $inc: { stock: 1 } }
              );
            //decrements quantity of the item in the cart
            dbo
              .collection("cart")
              .findOneAndUpdate(
                { name: req.body.name, userID: req.body.ID },
                { $inc: { quantity: -1 } }
              );
            console.log("item quantity decremented in cart");
            res.send(`success`);
          }
        }
      );
  });
});
//posts the id of the user to console
app.post("/check", (req, res) => {
  console.log(req.body.ID);
});
//called from delete button in cart
app.post("/deletefromcart", (req, res) => {
  MongoClient.connect(connectionURL, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    var itemQuantity;

    dbo
      .collection("cart")
      .findOne(
        { name: req.body.name, userID: req.body.ID },
        function (err, result) {
          if (err) throw err;
          else if (!result) {
            console.log("no results...");
            res.send(`failed`);
          } else if (result.quantity <= 0) {
            console.log("item not in cart");
            res.send(`failed`);
          } else {
            itemQuantity = result.quantity;
            dbo
              .collection("instruments")
              .findOneAndUpdate(
                { name: req.body.name },
                { $inc: { stock: itemQuantity } }
              );
            dbo
              .collection("cart")
              .findOneAndDelete({ name: result.name, userID: req.body.ID });
            console.log("item removed from cart");
            res.send(`success`);
          }
        }
      );
  });
});
//called by checkout button in cart page
app.post("/checkout", (req, res) => {
  MongoClient.connect(connectionURL, function (err, db) {
    console.log(req.body.ID);
    if (err) throw err;
    const dbo = db.db("mydb");
    //gets all items in cart for user.id for error handling
    dbo
      .collection("cart")
      .find({ userID: req.body.ID })
      .toArray(function (err, result) {
        if (err) throw err;
        else if (!result) {
          console.log("no results...");
          res.send(`no items in cart`);
        } else {
          console.log(result);
          //deletes all item in cart of user.id
          dbo.collection("cart").deleteMany({ userID: req.body.ID });
          console.log("purchase complete and cart is emptied");
          res.send(`success`);
        }
      });
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
