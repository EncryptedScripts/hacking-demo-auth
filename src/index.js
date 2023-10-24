const express = require("express");
const app = express();
const port = process.env.PORT || 8989;
const path = require("path");
const mongoose = require("mongoose");
const viewsPath = path.join(__dirname, "../views");
const { Auth } = require("./mongodb");

mongoose.connect("mongodb://mongo:27017/authdemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.set("views", viewsPath);

let Statuss = null;

async function createUserIfNotExists() {
  const username = "Admin";
  const password = "Admin123456789";

  try {
    const existingUser = await Auth.findOne({ username: username }).exec();

    if (!existingUser) {
      await Auth.create({
        username: username,
        password: password,
      });
      console.log("User Admin created in the database.");
    } else {
      console.log("User Admin already exists in the database.");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

createUserIfNotExists();

app.get("/auth", async (req, res) => {
  const { user, pass } = req.query;
  if (user && pass) {
    try {
      const userDoc = await Auth.findOne({
        username: user,
        password: pass,
      }).exec();

      if (userDoc) {
        Statuss = "true";
      } else {
        Statuss = "false";
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  res.render("index", { status: Statuss });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
