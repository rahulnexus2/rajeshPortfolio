import ContactMessage from '../models/ContactMessage.js';
import Analytics from '../models/Analytics.js';
import { sendContactNotification } from '../services/emailService.js';

// Submit contact form (Public)
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required fields.' });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address format.' });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject: subject || 'Portfolio Contact Inquiry',
      message
    });

    await newMessage.save();

    // Increment analytics for contact form submissions
    await Analytics.findOneAndUpdate(
      { key: 'global_stats' },
      { $inc: { contactSubmissions: 1 } },
      { upsert: true }
    );

    // Send email notification (asynchronous, doesn't block client response)
    sendContactNotification({ name, email, subject, message });

    return res.status(201).json({
      message: 'Thank you! Your message has been sent successfully.',
      data: newMessage
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get all messages (Admin only)
export const getMessages = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};

// Toggle read/unread status (Admin only)
export const toggleReadMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = !message.isRead;
    await message.save();

    return res.status(200).json({ message: `Message marked as ${message.isRead ? 'read' : 'unread'}`, message });
  } catch (error) {
    return res.status(500).json({ message: 'Error marking message status', error: error.message });
  }
};

// Delete message (Admin only)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
