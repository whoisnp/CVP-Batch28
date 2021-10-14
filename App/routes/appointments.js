const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { ensureAuthenticated } = require("../config/auth");

router.use(ensureAuthenticated);

router.get("/", (req, res) => {
  let uid = req.session.user.uid;
  let alerts = [];

  fetch(`http://localhost:3000/api/users/${uid}/appointments`)
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((appointments) => {
      res.render("home", {
        appointments,
      });
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt load your bands" });

      res.render("home", {
        alerts,
      });
    });
});

router.get("/addAppointment", (req, res) => {
  res.render("addBand");
});

router.post("/band", (req, res) => {
  let uid = req.session.user.uid;
  // console.log(uid);
  let { name, Dose, date, Vaccine } = req.body;
  let alerts = [];

  let band = {
    name,
    date,
    Dose,
    Vaccine,
    userUid: uid,
  };
  if (!uid | !name | !Dose | !date | !Vaccine) {
    alerts.push({ msg: "Enter all fields" });

    res.render("addBand", {
      band,
      alerts,
    });
  } else {
    fetch(`http://localhost:3000/api/users/${uid}/bands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(band),
    })
      .then((response) => checkStatus(response))
      .then((response) => response.json())
      .then((band) => {
        alerts.push({ msg: "Band added" });

        res.render("addBand", {
          alerts,
        });
      })
      .catch((err) => {
        alerts.push({ msg: "Could'nt add your band" });

        console.log(err);
        res.render("addBand", {
          band,
          alerts,
        });
      });
  }
});

router.get("/appointment/:bid", (req, res) => {
  let uid = req.session.user.uid;
  let bid = req.params.bid;
  let alerts = [];

  fetch(`http://localhost:3000/api/users/${uid}/bands/band/${bid}`)
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((band) => {
      res.render("editBand", {
        band,
      });
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt load your band" });

      console.log(err);
      res.render("editBand", {
        alerts,
      });
    });
});

router.post("/band/:bid", (req, res) => {
  let uid = req.session.user.uid;
  let bid = req.params.bid;
  let { name, description, origin, rating } = req.body;
  let alerts = [];

  let band = {
    bid,
    name,
    description,
    origin,
    rating,
  };

  fetch(`http://localhost:3000/api/users/${uid}/bands/band/${bid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(band),
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then(() => {
      alerts.push({ msg: "Band updated" });

      res.render("editBand", {
        band,
        alerts,
      });
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt update your band" });

      console.log(err);
      res.render("editBand", {
        band,
        alerts,
      });
    });
});

router.get("/band/del/:bid", (req, res) => {
  let uid = req.session.user.uid;
  let bid = req.params.bid;
  let alerts = [];

  fetch(`http://localhost:3000/api/users/${uid}/bands/band/${bid}`, {
    method: "DELETE",
  })
    .then((response) => checkStatus(response))
    .then(() => {
      res.redirect("/bands");
    })
    .catch((err) => {
      alerts.push({ msg: "Could'nt delete your band" });

      console.log(err);
      res.render("editBand", {
        band,
        alerts,
      });
    });
});

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    throw new Error();
  }
}

module.exports = router;
