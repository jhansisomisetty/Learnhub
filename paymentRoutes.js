const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create-order", auth, async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // INR in paisa
    currency: "INR",
    receipt: `rcpt_${Math.random().toString(36).substring(2, 15)}`,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send("Payment error");
  }
});

router.post("/verify", auth, async (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(order_id + "|" + payment_id);
  const digest = shasum.digest("hex");

  if (digest === signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;

// Frontend: Add Payment Button in StudentDashboard.jsx
// Inside <li> for each course:
{!enrolledCourses.some(c => c._id === course._id) && course.C_price > 0 && (
  <button onClick={() => handlePayment(course)}>Buy & Enroll</button>
)}

// In component logic:
const handlePayment = async (course) => {
  const res = await axios.post("http://localhost:5000/api/payment/create-order", {
    amount: course.C_price
  }, { headers: { Authorization: token } });

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: res.data.amount,
    currency: "INR",
    name: "LearnHub",
    description: "Course Purchase",
    order_id: res.data.id,
    handler: async function (response) {
      const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", response, {
        headers: { Authorization: token }
      });
      if (verifyRes.data.success) {
        handleEnroll(course._id);
      } else {
        alert("Payment verification failed");
      }
    },
    theme: { color: "#3399cc" }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};