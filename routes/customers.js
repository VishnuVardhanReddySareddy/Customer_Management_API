const express = require("express");
const router = express.Router();

const Customer = require("../models/customerModel");

// Getting all Customers

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Getting a Single customer with customerID

router.get("/:customerId", getCustomer, (req, res) => {
  res.json(res.customer);
});

// Creating a Customer

router.post("/", async (req, res) => {
  const newCustomer = new Customer({
    name: req.body.name,
    customerId: req.body.customerId,
    subscribedToService: req.body.subscribedToService,
  });

  try {
    const saveCustomer = await newCustomer.save();
    res.status(201).json(saveCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update the customer Data with customer ID

router.patch("/:customerId", getCustomer, async (req, res) => {
  //Here We will have access to res.customer object ,So we can directly compare and update
  //We will create Variable if User really made any changes or not ,if not we will not update .

  let isModified = false;

  if (req.body.name !== res.customer.name) {
    res.customer.name = req.body.name;
    isModified = true;
  }

  if (
    typeof req.body.subscribedToService === "boolean" &&
    req.body.subscribedToService !== res.customer.subscribedToService
  ) {
    res.customer.subscribedToService = req.body.subscribedToService;
    isModified = true;
  }

  if (isModified) {
    try {
      const updatedCustomer = await res.customer.save();
      res.json(updatedCustomer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "No changes made to Customer" });
  }
});

//Deleting the user with Customer ID

router.delete("/:customerId", getCustomer, async (req, res) => {
  try {
    if (!res.customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await res.customer.deleteOne();
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//MiddleWare for Getting a customer with customer ID

async function getCustomer(req, res, next) {
  try {
    const customer = await Customer.findOne({
      customerId: req.params.customerId,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found in DataBase" });
    }
    res.customer = customer;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = router;
