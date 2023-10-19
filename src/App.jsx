import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import SideNavbar from "./components/SideNavbar";
import Home from "./components/Home";
import Header from "./components/Header";
import { useState } from "react";
import SampleRequest from "./components/SampleRequest";
import Footer from "./components/Footer";
import ArticleDirectory from "./components/ArticleDirectory";
import Supplier from "./components/Supplier";
import LoginRegister from "./components/LoginRegister";
import Buyer from "./components/Buyer";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      {!isLoginPage && <Header toggleSidebar={toggleSidebar} />}

      <div className="parentContainer">
        {!isLoginPage && (
          <div>
            <SideNavbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
        )}
        <div className={isLoginPage ? "" : "childContainer"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/samplerequest" element={<SampleRequest />} />
            <Route path="/articledirectory" element={<ArticleDirectory />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/login" element={<LoginRegister />} />
          </Routes>
        </div>
      </div>

      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
