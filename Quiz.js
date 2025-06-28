const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  sectionIndex: Number,
  question: String,
  options: [String],
  correctAnswer: String
});

module.exports = mongoose.model("Quiz", quizSchema);
