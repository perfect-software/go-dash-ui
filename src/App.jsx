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
import ItemDirectory from "./components/ItemDirectory";
import ViewSr from "./components/ViewSr";
import { SidebarProvider } from "./context/SidebarContext";
import ViewBuyer from "./components/ViewBuyer";
import { Provider } from 'react-redux';
import { store } from './helper/store';
import Bom from "./components/Bom";
import ItemQuotation from "./components/ItemQuotation";
import SamplePipeline from "./components/SamplePipeline";
import SamplePipelineProgressView from "./components/SamplePipelineProgressView";
import PurchaseOrder from "./components/PurchaseOrder";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Provider store={store}>
      <SidebarProvider>
        {!isLoginPage && <Header toggleSidebar={toggleSidebar} />}

        <div className="parentContainer">
          {!isLoginPage && (
            <div>
              <SideNavbar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            </div>
          )}
          <div className={isLoginPage ? "" : "childContainer"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/samplerequest" element={<SampleRequest />}>
                <Route path="viewsr" element={<ViewSr />} />
              </Route>
              <Route path="/articledirectory" element={<ArticleDirectory />} />
              <Route path="/buyer" element={<Buyer />}>
                <Route path="viewBuyer" element={<ViewBuyer />} />
              </Route>
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/samplepipeline" element={<SamplePipeline />} />
              <Route path="/bom" element={<Bom/>}/>
              <Route path="/purchaseorder" element={<PurchaseOrder/>}/>
              <Route path="/Itemdirectory" element={<ItemDirectory />} />
              <Route path="/sampleprogress" element={<SamplePipelineProgressView />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/itemquotation" element={<ItemQuotation/>}/>
            </Routes>
          </div>
        </div>
        {!isLoginPage && <Footer />}
      </SidebarProvider>
      </Provider>
    </>
  );
}

export default App;
