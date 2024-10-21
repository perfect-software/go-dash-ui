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
import ProductionBom from "./components/ProductionBom";
import ProductionPurchaseOrder from "./components/ProductionPurchaseOrder";
import SampleCosting from "./components/SampleCosting";
import NewPurchaseOrder from "./components/NewPurchaseOrder";
import NewPurchaseOrderDetails from "./components/NewPurchaseOrderDetails";
import Dmtr from "./components/Dmtr";
import GatePass from "./components/GatePass";
import GatePassReceive from "./components/GatePassReceive";
import GenieEffect from "./components/GenieEffect";
import GatePassOutMisc from "./components/GatePassOutMisc";
import GatePassReceiveMisc from "./components/GatePassReceiveMisc";
import PerformaInvoice from "./components/PerformaInvoice";
import KarigarJobCard from "./components/KarigarJobCard";
import KarigarJobCardSecond from "./components/KarigarJobCardSecond";
import KarigarJobCardReceive from "./components/KarigarJobCardReceive";
import CreditNote from "./components/CreditNote";
import InvoiceWithoutWO from "./components/InvoiceWithoutWO";
import MaterialIssue from "./components/MaterialIssue";
import OrderCheckList from "./components/OrderCheckList";
import MaterialFloorReturn from "./components/MaterialFloorReturn";
import StockTransfer from "./components/StockTransfer";
import StockAdjustment from "./components/StockAdjustment";
import Reinspection from "./components/Reinspection";
import TestPO from "./components/TestPO";
import WorkerAdvance from "./components/WorkerAdvance";
import WorkerMaster from "./components/WorkMaster";
import BuyerOrderView from "./components/BuyerOrderView";
import PurchaseOrderRegister from "./components/PurchaseOrderRegister";
import PurchaseReceivedRegister from "./components/PurchaseReceivedRegister";
import MaterialIssueRegister from "./components/MaterialIssueRegister";
import GatePassIssueRegister from "./components/GatePassIssueRegister";
import GatePassReceiveRegister from "./components/GatePassReceiveRegister";
import KarigarJobRegister from "./components/KarigarJobRegister";
import WeeklyWagesReport from "./components/WeeklyWagesReport";
import ReinspectionSecond from "./components/ReinspectionSecond";
import PendingSupplierOrder from "./components/PendingSupplierOrder";
import BuyerLabAssign from "./components/BuyerLabAssign";
import LabTest from "./components/LabTest";
import TestMaster from "./components/TestMaster";
import UpdateTestResult from "./components/UpdateTestResult";
import TestReports from "./components/TestReports";
import AllowRateDiff from "./components/AllowRateDiff";
import SampleApprove from "./components/SampleApprove";
import ArticleActivity from "./components/ArticleActivity";
import ArticleActivityApprove from "./components/ArticleActivityApprove";
import ActivityMaster from "./components/ActivityMaster";
import MasterCardCreation from "./components/MasterCardCreation";


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
              <Route path="/srbom" element={<Bom/>}/>
              <Route path="/testpo" element={<TestPO/>}/>
              <Route path="/workermaster" element={<WorkerMaster/>}/>
              <Route path="/workerAdvance" element={<WorkerAdvance/>}/>
              <Route path="/reinspection" element={<Reinspection/>}/>
              <Route path="/reinspectionsecond" element={<ReinspectionSecond/>}/>
              <Route path="/samplecosting" element={<SampleCosting/>}/>
              <Route path="/newpurchaseorderdetails/:orderId" element={<NewPurchaseOrderDetails />} /> 
              <Route path="/prbom" element={<ProductionBom/>}/>
              <Route path="/purchaseorderregister" element={<PurchaseOrderRegister/>}/>
              <Route path="/purchasereceivedregister" element={<PurchaseReceivedRegister/>}/>
              <Route path="/purchaseorder" element={<PurchaseOrder/>}/>
              <Route path="/materialissueregister" element={<MaterialIssueRegister/>}/>
              <Route path="/gatepassissueregister" element={<GatePassIssueRegister/>}/>
              <Route path="/gatepassreceiveregister" element={<GatePassReceiveRegister/>}/>
              <Route path="/newpo" element={<NewPurchaseOrder/>}/>
              <Route path="/karigarjobregister" element={<KarigarJobRegister/>}/>
              <Route path="/pendingsupplierorder" element={<PendingSupplierOrder/>}/>
              <Route path="/dmtr" element={<Dmtr/>}/>
              <Route path="/mastercardcreation" element={<MasterCardCreation/>}/>
              <Route path="/activitymaster" element={<ActivityMaster/>}/>
              <Route path="/articleactivityapprove" element={<ArticleActivityApprove/>}/>
              <Route path="/articleactivity" element={<ArticleActivity/>}/>
              <Route path="/sampleapprove" element={<SampleApprove/>}/>
              <Route path="/allowratediff" element={<AllowRateDiff/>}/>
              <Route path="/testreports" element={<TestReports/>}/>
              <Route path="/updatetestresult" element={<UpdateTestResult/>}/>
              <Route path="/testmaster" element={<TestMaster/>}/>
              <Route path="/labtest" element={<LabTest/>}/>
              <Route path="/buyerlabassign" element={<BuyerLabAssign/>}/>
              <Route path="/buyerorderview" element={<BuyerOrderView/>}/>
              <Route path="/weeklywagesreport" element={<WeeklyWagesReport/>}/>
              <Route path="/genieeffect" element={<GenieEffect/>}/>
              <Route path="/gatepassreceive" element={<GatePassReceive/>}/>
              <Route path="/gatepassoutmisc" element={<GatePassOutMisc/>}/>
              <Route path="/gatepassreceivemisc" element={<GatePassReceiveMisc/>}/>
              <Route path="/gatepass" element={<GatePass/>}/>
              <Route path="/stocktransfer" element={<StockTransfer/>}/>
              <Route path="/stockadjustment" element={<StockAdjustment/>}/>
              <Route path="/karigarjobcard" element={<KarigarJobCard/>}/>
              <Route path="/karigarjobcardsecond" element={<KarigarJobCardSecond/>}/>
              <Route path="/karigarjobcardreceive" element={<KarigarJobCardReceive/>}/>
              <Route path="/creditnote" element={<CreditNote/>}/>
              <Route path="/materialfloorreturn" element={<MaterialFloorReturn/>}/>
              <Route path="/orderchecklist" element={<OrderCheckList/>}/>
              <Route path="/materialissue" element={<MaterialIssue/>}/>
              <Route path="/invoicewithoutwo" element={<InvoiceWithoutWO/>}/>
              <Route path="/performainvoice" element={<PerformaInvoice/>}/>
              <Route path="/prodpurchaseorder" element={<ProductionPurchaseOrder/>}/>
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
