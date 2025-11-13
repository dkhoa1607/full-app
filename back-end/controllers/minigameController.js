import User from '../models/userModel.js';

// Danh sách phần thưởng
const PRIZES = [
  { option: '10% OFF', code: 'SPIN10', probability: 0.3 },
  { option: 'Good Luck', code: null, probability: 0.4 },
  { option: '20% OFF', code: 'SPIN20', probability: 0.1 },
  { option: 'Free Ship', code: 'FREESHIP', probability: 0.15 },
  { option: '5$ OFF', code: 'LUCKY5', probability: 0.05 },
];

const spinWheel = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Kiểm tra 1 tuần quay 1 lần
    if (user.lastSpinDate) {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const timeDiff = Date.now() - new Date(user.lastSpinDate).getTime();
      if (timeDiff < oneWeek) {
        const daysLeft = Math.ceil((oneWeek - timeDiff) / (24 * 60 * 60 * 1000));
        return res.status(400).json({ message: `Bạn đã quay rồi! Quay lại sau ${daysLeft} ngày.` });
      }
    }

    // Logic random
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedPrizeIndex = 0;

    for (let i = 0; i < PRIZES.length; i++) {
      cumulativeProbability += PRIZES[i].probability;
      if (random < cumulativeProbability) {
        selectedPrizeIndex = i;
        break;
      }
    }

    // Lưu ngày quay
    user.lastSpinDate = Date.now();
    await user.save();
    console.log("Đã lưu ngày quay cho user:", user.email, user.lastSpinDate);
    res.json({
      prizeIndex: selectedPrizeIndex,
      prize: PRIZES[selectedPrizeIndex]
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { spinWheel };