"use strict";
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("exercise_62");
    const seats = await db.collection("seats").find().toArray();
    const response = {};

    seats.forEach((seat) => {
      response[seat._id] = seat;
    });

    res.status(201).json({
      seats: response,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {}
};

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  console.log(req.body);

  if (!creditCard || !expiration || !fullName || !email) {
    return res.status(400).json({
      status: 400,
      message: "Please provide customer and credit card information!",
    });
  }

  try {
    await client.connect();
    const db = client.db("exercise_62");

    const query = { _id: seatId };
    const newValues = {
      $set: { isBooked: true, customer: { fullName, email } },
    };

    const r = await db.collection("seats").updateOne(query, newValues);
    // console.log(r);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    // if (!seat) {
    //   return res.status(404).json({
    //     status: "error",
    //     message: "invalid seat query",
    //   });
    // }
    // if (seat.isBooked) {
    //   console.log(seat);
    //   return res.status(400).json({
    //     status: "error",
    //     message: "seat is already booked",
    //   });
    // }

    res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

module.exports = { getSeats, bookSeat };
