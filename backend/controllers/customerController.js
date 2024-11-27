const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Public
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    login customer
// @route   POST /api/customers/register
// @access  Public
const registerCustomer = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Check if the username or email already exists
        const existingCustomer = await Customer.findOne({ 
            $or: [{ username }, { email }] 
        });
        if (existingCustomer) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Create a new customer
        const customer = new Customer({
            username,
            email,
            password, // Storing plain text password (not recommended)
        });

        // Save the customer to the database
        await customer.save();

        // Respond with success
        res.status(201).json({
            message: 'Customer registered successfully',
            customer: {
                id: customer._id,
                username: customer.username,
                email: customer.email,
            },
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    login customer
// @route   POST /api/customers/login
// @access  Public
const loginCustomer = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({status: false, message: 'Username and password are required' });
        }

        // Fetch the customer by username
        const customer = await Customer.findOne({ username });

        if (!customer) {
            return res.status(404).json({ status: false, message: 'Customer not found' });
        }

        // Compare passwords
        if (customer.password != password ) {
            return res.status(401).json({status: false, message: 'Invalid username or password' });
        }
        // If successful, return customer details (excluding sensitive information)
        res.json({
            id: customer._id,
            name: customer.name,
            email: customer.email,
        });
    } catch (error) {
        console.error('Error logging in customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public
const createCustomer = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newCustomer = new Customer({
      username,
      email,
      password,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
  const {username, email, password  } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.username = username || customer.username;
    customer.email = email || customer.email;
    customer.password = password || customer.password;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    registerCustomer,
    loginCustomer
};
