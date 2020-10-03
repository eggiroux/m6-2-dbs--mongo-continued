const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  resetSeat,
  updateCustomerInfo,
} = require("./handlers");

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", bookSeat);

router.put("/api/reset-seat", resetSeat);

router.put("/api/update-customer-info", updateCustomerInfo);

module.exports = router;
