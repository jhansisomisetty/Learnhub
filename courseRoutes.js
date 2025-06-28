import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getEnrolledCourses,
  checkCourseCompletion,
  markCourseCompleted,
  getCertificate,
  getCourseQuiz,
  getQuizScore,
  submitQuiz,
  addComment,
} from "../controllers/courseController.js";

const router = express.Router();

// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Student Routes (Requires Auth)
router.post("/enroll/:courseId", auth, enrollInCourse);
router.get("/enrolled", auth, getEnrolledCourses);
router.get("/:id/completion", auth, checkCourseCompletion);
router.post("/:id/complete", auth, markCourseCompleted);
router.get("/:id/certificate", auth, getCertificate);

// Quiz Routes
router.get("/:id/quiz", auth, getCourseQuiz);
router.get("/:id/score", auth, getQuizScore);
router.post("/:id/quiz", auth, submitQuiz);

// Comments and Ratings
router.post("/:id/comment", auth, addComment);

// Teacher Route
router.post("/", auth, createCourse);

export default router;
