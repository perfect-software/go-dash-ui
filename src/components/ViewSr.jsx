import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewSr.module.css";

const ViewSr = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = [
    { headerName: 'SR No.', field: 'sampleRef', sortable: true, filter: true  },
    { headerName: 'Date of Order', field: 'buyer.entDate', sortable: true, valueGetter: (params) => params.data.buyer?.entDate, valueFormatter: (params) => formatDDMMYYYYDate(params.value) , filter: true  },
    { headerName: 'Season', field: 'season', sortable: true , filter: true },
    { headerName: 'Article No', field: 'articleNo', sortable: true , filter: true },
    { headerName: 'Buyer', field: 'buyer.bsName', sortable: true, valueGetter: (params) => params.data.buyer?.bsName , filter: true  },
    { headerName: 'Sample Type', field: 'sampleType', sortable: true , filter: true  },
    { headerName: 'Buyer Article', field: 'buyerArticle', sortable: true  , filter: true },
  ];
  const callApi = async () => {
    setLoading(true);
    const BASE_URL = `http://localhost:8081/api/sample/viewAllSample`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedSample = response.data;
      setSamples(fetchedSample);
     console.log(fetchedSample);
    } catch (error) {
      console.error("Failed to fetch All Sample:", error);
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
            rowData={samples}
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

export default ViewSr;
