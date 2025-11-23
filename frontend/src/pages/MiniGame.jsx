import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useAuth } from '../context/AuthContext';

// Dữ liệu hiển thị trên vòng quay (Phải khớp thứ tự với Backend)
const data = [
  { option: '10% OFF', style: { backgroundColor: '#DB4444', textColor: 'white' } },
  { option: 'Good Luck', style: { backgroundColor: 'black', textColor: 'white' } },
  { option: '20% OFF', style: { backgroundColor: '#DB4444', textColor: 'white' } },
  { option: 'Free Ship', style: { backgroundColor: 'black', textColor: 'white' } },
  { option: '5$ OFF', style: { backgroundColor: '#DB4444', textColor: 'white' } },
];

function MiniGame() {
  const { user } = useAuth();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0); // Index của giải thưởng
  const [winData, setWinData] = useState(null); // Dữ liệu giải thưởng (mã code)
  const [spinning, setSpinning] = useState(false); // Trạng thái đang quay

  const handleSpinClick = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia!");
      return;
    }
    if (spinning) return;

    try {
      setSpinning(true); // Bắt đầu trạng thái chờ

      // 1. Gọi Backend để xin kết quả trước (Bảo mật, tránh hack client)
      // Backend sẽ tính toán tỉ lệ và trả về luôn bạn trúng cái gì
      const res = await fetch('https://full-app-da2f.vercel.app/api/minigame/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Backend trả về index giải thưởng -> Gán vào vòng quay để nó quay tới đó
        setPrizeNumber(data.prizeIndex); 
        setWinData(data.prize);
        setMustSpin(true); // Bắt đầu hiệu ứng quay
      } else {
        setSpinning(false);
        alert(data.message); // Báo lỗi (ví dụ: chưa đủ 7 ngày)
      }
    } catch (error) {
      setSpinning(false);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className="container mx-auto py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">Lucky Wheel</h1>
      <p className="mb-8 text-gray-600">Spin weekly to get exclusive coupons!</p>

      <div className="relative">
        {/* Vòng quay */}
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            setSpinning(false);
            if (winData && winData.code) {
              alert(`Chúc mừng! Bạn trúng: ${winData.option}\nMã giảm giá: ${winData.code}\nHãy dùng nó ở giỏ hàng nhé!`);
            } else {
              alert("Rất tiếc! Chúc bạn may mắn lần sau.");
            }
          }}
          backgroundColors={['#3e3e3e', '#df3428']}
          textColors={['#ffffff']}
          outerBorderColor="#eeeeee"
          outerBorderWidth={10}
          innerRadius={20}
          radiusLineColor="#eeeeee"
          radiusLineWidth={1}
        />
        
        {/* Nút Bấm Quay (Ở giữa) */}
        <button 
          onClick={handleSpinClick}
          disabled={spinning}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 bg-white rounded-full border-4 border-red-500 font-bold text-red-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          {spinning ? "..." : "SPIN"}
        </button>
      </div>

      {/* Hướng dẫn */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-md text-center border border-gray-200">
        <h3 className="font-bold mb-2 text-lg">Terms & Conditions</h3>
        <p className="text-sm text-gray-500">
          Each account gets <strong>one free spin per week</strong>.
          The discount code is valid for 24 hours. Good luck!
        </p>
      </div>
    </div>
  );
}

export default MiniGame;