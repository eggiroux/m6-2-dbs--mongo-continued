const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Code that is generating the seats.
// ----------------------------------
const seats = [];
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats.push({
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    });
  }
}

const bookRandomSeats = (num) => {
  let bookedSeats = [];
  while (num > 0) {
    console.log(num);
    const seatIndex = Math.floor(Math.random() * seats.length);

    if (!bookedSeats.includes(seatIndex)) {
      seats[seatIndex].isBooked = true;
      bookedSeats.push(seatIndex);

      num--;
    }
  }
};

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = client.db("exercise_62");
    const r = await db.collection("seats").insertMany(seats);
    assert.equal(seats.length, r.insertedCount);

    console.log({ status: 201 });
  } catch (err) {
    console.log({ status: 500, message: err.message });
  }

  client.close();
};

bookRandomSeats(30);

batchImport();

//console.log(seats);
