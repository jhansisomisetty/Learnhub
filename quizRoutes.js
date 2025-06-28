const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Quiz = require("../models/Quiz");

// Get quiz question for a course section
router.get("/:courseId/:sectionIndex", auth, async (req, res) => {
  const { courseId, sectionIndex } = req.params;
  const quiz = await Quiz.findOne({ courseId, sectionIndex });
  if (!quiz) return res.status(404).json({ error: "No quiz found" });

  res.json({
    question: quiz.question,
    options: quiz.options
  });
});

// Submit answer
router.post("/:courseId/:sectionIndex/submit", auth, async (req, res) => {
  const { courseId, sectionIndex } = req.params;
  const { answer } = req.body;

  const quiz = await Quiz.findOne({ courseId, sectionIndex });
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  const isCorrect = quiz.correctAnswer === answer;
  res.json({ correct: isCorrect });
});

module.exports = router;
