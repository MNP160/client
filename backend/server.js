//imports
const mongoose = require("mongoose"); //database operations
const express = require("express");
var cors = require("cors");  //communication with front end
const bodyParser = require("body-parser"); //parsing requests
const logger = require("morgan");  //logging
const Data = require("./data");  //custom database schema
const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// MongoDb Atlas connection string

var mongoDB ="mongodb+srv://mnp:mladen@cluster0-rutbx.mongodb.net/test?retryWrites=true";
console.log(mongoDB);
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;

// checking database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => console.log("connected to the database"));

// parsing the request body to be readable format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

//getting single Book by id
router.get("/getData/:id", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data  });
 });
});


// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, title, summary } = req.body;

  if ((!id && id !== 0) || !title) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.title = title;
  data.id = id;
  data.summary=summary;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// for http request
app.use("/api", router);

// launch into available port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
