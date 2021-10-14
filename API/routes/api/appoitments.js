const express = require("express");
const route = express.Router();
const appointment = require("../../db-config/models/appointment");

route.get("/:uid/appointments", (req, res) => {
  appointment.find({
    userUid: req.params.uid,
  })
    .then((appointments) => {
      if (appointments) {
        res.status(200).send(appointments);
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        error: "Could not retrieve appointments for user: " + req.params.uid,
      });
    });
});

route.post("/:uid/bands", (req, res) => {
  var c;
  console.log(req.params.uid);
  console.log(req.body);
  appointment.findOne({}, async function (err, data) {
    if (data) {
      c = data.bid + 1;
      console.log(c);
    } else {
      c = 1;
    }
    console.log(req.params.uid);
    console.log(req.body);
    try {
      appointment.create({
        bid: c,
        name: req.body.name,
        Dose: req.body.Dose,
        date: req.body.date,
        Vaccine: req.body.Vaccine,
        userUid: req.params.uid,
      })
        .then((appointment) => {
          console.log("User added => ", appointment);
          res.status(201).send(appointment);
        })
        .catch((err) => {
          res.status(501).send({
            error: "Could not add new band",
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

route.get("/:uid/bands/band/:bid", (req, res) => {
  Band.findOne({ bid: req.params.bid })
    .then((band) => {
      if (band) {
        res.status(200).send(band);
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Could'nt find band",
      });
    });
});

route.put("/:uid/bands/band/:bid", (req, res) => {
  Band.update(
    {
      bid: req.params.bid,
    },
    {
      name: req.body.name,
      description: req.body.description,
      origin: req.body.origin,
      rating: req.body.rating,
    }
  )
    .then((rowsUpdated) => {
      res.status(200).send(rowsUpdated);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({
        error: "Cound'nt update band.",
      });
    });
});

route.delete("/:uid/bands/band/:bid", (req, res) => {
  Band.deleteOne({
    bid: req.params.bid,
  })
    .then((deleted) => {
      if (deleted) {
        res.sendStatus(200);
      } else {
        res.status(404).send({
          error: "Could'nt delete Band",
        });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(404).send({
        error: "Could'nt delete Band",
      });
    });
});

module.exports = route;
