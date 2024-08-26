const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  customerId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  subscribedToService: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
