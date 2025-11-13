import Contact from '../models/contactModel.js';

// @desc   Gửi tin nhắn liên hệ
// @route  POST /api/contact
const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export { sendMessage };