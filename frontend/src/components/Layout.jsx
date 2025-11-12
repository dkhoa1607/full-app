import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Announcement />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;