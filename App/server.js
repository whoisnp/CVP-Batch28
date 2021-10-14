const express = require("express");
const app = express();
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const route = require("./routes");

app.use(
  session({
    secret: "nobody should guess this",
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: false,
    },
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use("/", route);

app.listen("3001", () => {
  console.log("Listening to http://localhost:3001/");
});
