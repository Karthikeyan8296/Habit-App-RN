const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//For connecting with Mongo db//
mongoose
  .connect("mongodb+srv://karthik:Kar%402004@mindpath.jlbkf.mongodb.net/")
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((error) => {
    console.log("Error Connected to mongoDB", error);
  });

app.listen(port, () => {
  console.log("Server running on port 3000");
});
///////////////////

const Habit = require("./models/habit");
//Endpoint to create an New Habit in the backend//
//req - request | res - response//
//post - sending the data to the backend
app.post("/habits", async (req, res) => {
  try {
    const { title, color, repeatMode, reminder } = req.body;
    const newHabit = new Habit({
      title,
      color,
      repeatMode,
      reminder,
    });

    // after doing this we need to save it in backend//
    const savedHabit = await newHabit.save();
    res.status(200).json(savedHabit);
  } catch (error) {
    res.status(500).json({ error: "Network Error" });
  }
});

//Get or Fetch the data from the backend//
//Initialing the endpoint for this//
app.get("/habitsList", async (req, res) => {
  try {
    const allHabits = await Habit.find({});

    res.status(200).json(allHabits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ToMark an habit as complete for that day//
//To mark and update, we are using another end-point//
app.put("/habits/:habitId/completed", async (req, res) => {
  const habitId = req.params.habitId;
  const updateCompletion = req.body.completed;
  console.log("Received completion data:", updateCompletion);

  try {
    const updatedhabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updateCompletion },
      { new: true }
    );
    if (!updatedhabit) {
      return res.status(404).json({ error: "habit not found" });
    }
    return res.status(200).json(updatedhabit);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error.message });
  }
});

//To delete an habit//
app.delete("/habits/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    await Habit.findByIdAndDelete(habitId);
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete the habit" });
  }
});

//all api endpoint are declared//
