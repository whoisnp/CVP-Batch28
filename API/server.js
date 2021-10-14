const express = require("express");
const app = express();
const db = require("./db-config/db");
const route = require("./routes/api");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", route);

app.listen("3000", () => {
  console.log("Listening to http://localhost:3000/");
});

// db.sync()
//     .then(() => console.log('DB synced successfully.'))
//     .catch((err) => console.log(err)
// );
