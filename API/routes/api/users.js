const express = require("express");
const route = express.Router();
const User = require("../../db-config/models/user");

route.get("/", (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({
        error: "could not retrieve users",
      });
    });
});

route.get("/:uid", (req, res) => {
  User.findOne({ uid: req.params.uid })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      res.status(404).send({
        error: "Could not find user",
      });
    });
});

route.post("/", (req, res) => {
  var c;
  User.findOne({}, async function (err, data) {
    if (data) {
      c = data.uid + 1;
      // console.log(data);
    } else {
      c = 1;
    }
    // console.log(req.body);
    try {
      User.create({
        uid: c,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        organization: req.body.organization,
        dob: req.body.dob,
      })
        .then((user) => {
          console.log(user);
          res.status(201).send(user);
        })
        .catch((err) => {
          res.status(501).send({
            error: "Email already taken. Could'nt create user.",
          });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server error Occured");
    }
  })
    .sort({ _id: -1 })
    .limit(1);
});

route.post("/user", (req, res) => {
  let { email } = req.body;
  User.findOne({
    email,
  })
    .then((user) => {
      if (user) {
        console.log(user);
        res.status(200).send(user);
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      res.status(401).send({
        error: "Wrong email or password.",
      });
    });
});

route.put("/user/:uid", (req, res) => {
  User.update(
    {
      uid: req.params.uid,
    },
    {
      name: req.body.name,
      email: req.body.email,
      organization: req.body.organization,
      dob: req.body.dob,
    }
  )
    .then((rowsUpdated) => {
      res.status(200).send(rowsUpdated);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Cound'nt update user.",
      });
    });
});

route.put("/send-otp", (req, res) => {
  User.update(
    {
      email: req.body.email,
    },
    {
      otp: req.body.otp,
    }
  )
    .then((rowsUpdated) => {
      res.status(200).send(rowsUpdated);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Cound'nt update user.",
      });
    });
});

route.post("/verify-otp", (req, res) => {
  let email = req.body.email;

  User.findOne(
    {
      email,
    },
    { otp: "" }
  )
    .then((otp) => {
      res.status(200).send(otp);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Cound'nt find email.",
      });
    });
});

route.put("/reset-pswd", (req, res) => {
  User.update(
    {
      email: req.body.email,
    },
    {
      password: req.body.password,
    }
  )
    .then((rowsUpdated) => {
      res.status(200).send(rowsUpdated);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Cound'nt update user.",
      });
    });
});

route.use("/", require("./appoitments"));

module.exports = route;
