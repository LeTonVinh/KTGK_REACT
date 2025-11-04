import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";

const Layout = () => {
  return (
    <>
      <Header />
      <Banner />
      <div className="news-home">
        <div className="container_main" style={{ minHeight: 5500 }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
