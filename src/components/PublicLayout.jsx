import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PublicLayout() {
  return (
    <div className="page">
      <Navbar />
      <main className="container main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
