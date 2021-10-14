const express = require("express");
const router = express.Router();
const session = require("express-session");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { sendOTP, getOTP } = require("../config/otp-config");
const { response } = require("express");

router.post("/login", (req, res) => {
  let { email, password } = req.body;
  let alerts = [];

  if (!email | !password) {
    alerts.push({ msg: "Enter email and password!" });

    res.render("login", {
      alerts,
    });
  } else {
    let findUser = {
      email,
      password,
    };

    fetch("http://localhost:3000/api/users/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(findUser),
    })
      .then((response) => checkStatus(response))
      .then((response) => response.json())
      .then((user) => {
        bcrypt.compare(findUser.password, user.password, function (err, match) {
          if (match) {
            req.session.user = {
              uid: user.uid,
            };
            res.redirect(`/appointments`);
          } else {
            alerts.push({ msg: "Invalid Email or Password!" });
            res.render("login", {
              alerts,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);

        alerts.push({ msg: "Email not registered!" });
        res.render("login", {
          alerts,
        });
      });
  }
});

router.post("/register", (req, res) => {
  const { name, email,dob, password, confirmPassword } =
    req.body;

  let alerts = [];
  console.log(alerts);

  if (!name | !email |  !dob | !password | !confirmPassword) {
    alerts.push({ msg: "Enter all fields!" });
    console.log(alerts);
    res.render("register", {
      alerts,
    });
  } else if (password != confirmPassword) {
    alerts.push({ msg: "Passwords do not match!" });
    res.render("register", {
      alerts,
    });
  } else {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      let newUser = {
        name,
        email,
        password: hash,
        dob,
      };

      fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => checkStatus(response))
        .then((response) => response.json())
        .then((user) => {
          alerts.push({ msg: "Registration successfull!" });
          res.render("login", {
            alerts,
          });
        })
        .catch((err) => {
          alerts.push({ msg: "Email already exists!" });
          res.render("register", {
            alerts,
          });
        });
    });
  }
});

router.post("/user/:uid", (req, res) => {
  const { name, email, organization, dob } = req.body;
  const uid = req.params.uid;
  const user = {
    uid,
    name,
    email,
    organization,
    dob,
  };
  let alerts = [];

  fetch(`http://localhost:3000/api/users/user/${uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then(() => {
      alerts.push({ msg: "Profile updated" });

      res.render("profile", {
        user,
        alerts,
      });
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt update your profile" });

      console.log(err);
      res.render("profile", {
        user,
        alerts,
      });
    });
});

router.get("/logout", (req, res) => {
  const alerts = [];
  alerts.push({ msg: "You were logged out!" });
  req.session.user = {};

  res.render("login", {
    alerts,
  });
});

router.get("/profile", (req, res) => {
  const uid = req.session.user.uid;

  fetch(`http://localhost:3000/api/users/${uid}`)
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((user) => {
      res.render("profile", {
        user,
      });
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt load your profile" });

      console.log(err);
      res.render("profile", {
        alerts,
      });
    });
});

router.post("/reset-pswd-send-otp", (req, res) => {
  const email = req.body.email;
  const otp = getOTP();
  let alerts = [];

  sendOTP(email, otp);

  const emailOTP = {
    email,
    otp,
  };

  fetch("http://localhost:3000/api/users/send-otp", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(emailOTP),
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((updated) => {
      if (updated.n) {
        alerts.push({ msg: "OTP sent to your registered Email" });

        res.render("reset-pswd-verify-otp", {
          email,
          alerts,
        });
      } else {
        alerts.push({ msg: "Email Not Registered" });
        console.log("Email Not Registered");
        res.render("reset-pswd-send-otp", {
          alerts,
        });
      }
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt send OTP" });

      console.log(err);
      res.render("reset-pswd-send-otp", {
        alerts,
      });
    });
});

router.post("/reset-pswd-verify-otp", (req, res) => {
  const { email, otp } = req.body;
  let alerts = [];

  fetch("http://localhost:3000/api/users/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      email,
    }),
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => {
      if (response.otp == otp) {
        res.render("reset-pswd", {
          email,
        });
      } else {
        alerts.push({ msg: "Incorrect OTP" });
        res.render("reset-pswd-verify-otp", {
          email,
          alerts,
        });
      }
    })
    .catch((err) => {
      alerts.push({ msg: "Error in verifying OTP" });
      res.render("reset-pswd-verify-otp", {
        email,
        alerts,
      });
    });
});

router.post("/reset-pswd", (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  let alerts = [];

  if (!newPassword | !confirmPassword) {
    alerts.push({ msg: "Enter all fields!" });

    res.render("reset-pswd", {
      alerts,
    });
  } else if (newPassword != confirmPassword) {
    alerts.push({ msg: "Passwords do not match!" });
    res.render("reset-pswd", {
      alerts,
    });
  } else {
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
      let updateUser = {
        email,
        password: hash,
      };

      fetch("http://localhost:3000/api/users/reset-pswd", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(updateUser),
      })
        .then((response) => checkStatus(response))
        .then((response) => response.json())
        .then((user) => {
          alerts.push({ msg: "Reset Password Successfull" });
          res.render("login", {
            alerts,
          });
        })
        .catch((err) => {
          alerts.push({ msg: "Reset Password Failed" });
          res.render("login", {
            alerts,
          });
        });
    });
  }
});

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    throw new Error();
  }
}

module.exports = router;

/*
     fetch('http://localhost:3000/api/users/')
    .then((res) => checkStatus(res))
    .then( res => res.json())
    .then( (users) => {
       console.log(users[0]);
    })
*/
