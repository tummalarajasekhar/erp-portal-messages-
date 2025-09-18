const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all messages for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.params.userId
    }).populate('sender', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { sender, recipient, subject, content } = req.body;
    
    const message = await Message.create({
      sender,
      recipient,
      subject,
      content
    });

    await message.populate('sender', 'name email');
    await message.populate('recipient', 'name email');

    res.status(201).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark message as read
router.patch('/:messageId/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;