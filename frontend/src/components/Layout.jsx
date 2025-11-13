import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";


function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative"> {/* Thêm relative nếu cần */}
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      {/* 2. Đặt ChatBot ở đây */}
      
    </div>
  );
}

export default Layout;