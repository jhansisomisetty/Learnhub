// backend/models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  C_title: { type: String, required: true },
  C_description: String,
  C_categories: String,
  C_price: Number,
  C_educator: String,
  sections: [String],

  enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  completed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  quiz: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],

  scores: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number
    }
  ],

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Course", courseSchema);
