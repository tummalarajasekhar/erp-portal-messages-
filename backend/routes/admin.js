const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all students (admin only)
router.get('/students', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const students = await User.find({ role: 'student' }).select('-password');

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin sends message to all students
// routes/admin.js
router.post('/broadcast', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { subject, content, recipients } = req.body;

    let students;
    if (recipients && recipients.length > 0) {
      // Selected students
      students = await User.find({ _id: { $in: recipients }, role: 'student' });
    } else {
      // All students
      students = await User.find({ role: 'student' });
    }

    if (!students.length) {
      return res.status(404).json({ message: 'No students found to send message.' });
    }

    const messagePromises = students.map((student) =>
      Message.create({
        sender: req.user.id,
        recipient: student._id,
        subject,
        content,
      })
    );

    await Promise.all(messagePromises);

    res.status(200).json({
      status: 'success',
      message: `Message sent to ${students.length} student(s)`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;