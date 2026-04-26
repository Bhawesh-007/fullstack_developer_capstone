const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Correct JSON file loading
const reviews_data = JSON.parse(
  fs.readFileSync("./data/reviews.json", "utf8")
);

const dealerships_data = JSON.parse(
  fs.readFileSync("./data/dealerships.json", "utf8")
);

// ✅ Correct Mongo connection (LOCAL)
mongoose.connect("mongodb://127.0.0.1:27017/dealershipsDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ✅ Correct Mongoose models (IMPORTANT FIX)
const Reviews = require('./reviews');
const Dealerships = require('./dealership');


// ---------------- SEED DATABASE ----------------
const seedDB = async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

    console.log("Database seeded successfully");
  } catch (err) {
    console.log("Seeding error:", err);
  }
};

seedDB();


// ---------------- ROUTES ----------------

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});


// Get all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});


// Get reviews by dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({
      dealership: parseInt(req.params.id)
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealer reviews" });
  }
});


// Get all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dealers" });
  }
});


// Get dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({
      state: req.params.state
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching by state" });
  }
});


// Get dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const document = await Dealerships.findOne({
      id: parseInt(req.params.id)
    });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealer by id" });
  }
});


// Insert review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    const documents = await Reviews.find().sort({ id: -1 });

    let new_id = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});