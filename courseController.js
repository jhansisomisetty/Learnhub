export const getQuizScore = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const result = course.scores?.find(s => s.userId.toString() === req.user.id);
    res.json({ score: result?.score ?? null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const userAnswers = req.body.answers;
    const quiz = course.quiz;

    if (!quiz || quiz.length === 0) {
      return res.status(400).json({ message: "No quiz available" });
    }

    let score = 0;
    for (let i = 0; i < quiz.length; i++) {
      if (quiz[i].correctAnswer === userAnswers[i]) score++;
    }

    const existing = course.scores.find(s => s.userId.toString() === req.user.id);
    if (existing) {
      existing.score = score;
    } else {
      course.scores.push({ userId: req.user.id, score });
    }

    await course.save();
    res.json({ message: "Quiz submitted", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
