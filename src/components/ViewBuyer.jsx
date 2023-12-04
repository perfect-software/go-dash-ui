import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import styles from "../styles/viewBuyer.module.css";

const ViewBuyer = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = [
    { headerName: "Buyer", field: "bsName", sortable: true, filter: true },
    {
      headerName: "Code",
      field: "code",
      sortable: true,
      filter: true,
     
    },
    { headerName: "Bs Abbr", field: "bsAbbreviation", sortable: true, filter: true },
    { headerName: "Delivery Address", field: "deliveryAddress", sortable: true, filter: true },
    { headerName: "Billing Address", field: "billingAddress", sortable: true, filter: true },
   
  ];

  const callApi = async (page = 1) => {
    setLoading(true);
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/sample/getAllBuyer/{page_num}?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedBuyer = response.data;

      setBuyers(fetchedBuyer);
    } catch (error) {
      console.error("Failed to fetch All buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  

  return (
    <div className={isCollapsed ? styles.topContainer : styles.topContainerOpen}>
      {loading ? (
        <div>Loading...</div> 
      ) : (
        <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={buyers}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            filter={true}
          />
        </div>
      )}
    </div>
  );
};

export default ViewBuyer;
