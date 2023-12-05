import React, { useState, useEffect , useMemo } from "react";
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
    { headerName: 'Date of Order', field: 'dateOfOrder',sortable: true, valueFormatter: (params) => formatDDMMYYYYDate(params.value) , filter: true  },
    { headerName: 'Season', field: 'season', sortable: true , filter: true },
    { headerName: 'Article No', field: 'articleNo', sortable: true , filter: true },
    { headerName: 'Buyer', field: 'buyer.bsName', sortable: true, filter: true  },
    { headerName: 'Sample Type', field: 'sampleType', sortable: true , filter: true  },
    { headerName: 'Buyer Article', field: 'buyerArticle', sortable: true  , filter: true },
    { headerName: 'Upper Color', field: 'upperColor', sortable: true  , filter: true },
    { headerName: 'Lining Color', field: 'liningColor', sortable: true  , filter: true },
    { headerName: 'Last', field: 'last', sortable: true  , filter: true },
    { headerName: 'Insole', field: 'insole', sortable: true  , filter: true },
  ];
  const callApi = async () => {
    setLoading(true);
    const BASE_URL = `http://localhost:8081/api/sample/viewAllSample`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedSample = response.data;
      setSamples(fetchedSample);
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
    <div className={styles.popupOverlay}>
      {loading ? (
      <>
          <div className={styles.loader}></div>
          <h2>Loading Requests..</h2>
          </>
      ) : (
    <div className={styles.topContainer}>
      
        <div className={`ag-theme-quartz ${styles.agThemeQuartz}`} style={{ height: 600, width: "100%" }}>
          <AgGridReact
           columnDefs={columnDefs}
           rowData={samples}
           pagination={true}
           paginationPageSize={10}
           sideBar={true}
           animateRows={true}
           filter={true}
          />
        </div>
     
    </div>
     )}
    </div>
  );
};

export default ViewSr;
