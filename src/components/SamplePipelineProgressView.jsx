import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import viewStyles from "../styles/viewDetails.module.css";
import { postApiService } from "../service/apiService";
import Downshift from "downshift";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";

const SamplePipelineProgressView = () => {
  const [activeButton, setActiveButton] = useState("progress");
  const [itemSelect,setItemSelect] = useState(null);
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [isEditSelected, setIsEditSelected] = useState(false);

  const dispatch = useDispatch();
  const { samples, loaded, loading, error } = useSelector(
    (state) => state.sample
  );

  const handleSamplePipelineChange = (e) => {
    const { name, value } = e.target;

    setSamplePipeline((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [samplePipeline, setSamplePipeline] = useState(() => {
    const savedForm = localStorage.getItem("samplePipeline");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          barcode:"",
          department:""
        };
  });
  useEffect(() => {
    localStorage.setItem("samplePipeline", JSON.stringify(samplePipeline));
  }, [samplePipeline]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const [gridApiInput, setGridApiInput] = useState(null);
  const onGridReadyInput = useCallback((params) => {
    setGridApiInput(params.api);
    if (!loaded && !loading) {
 dispatch(fetchAllSamples());
    }
  }, []);

  useEffect(() => {
    if (gridApiInput && !loaded && loading) {
      gridApiInput.showLoadingOverlay();
    }
  }, [ loaded, loading, gridApiInput]);

  useEffect(() => {
    const toggleActiveButton = (event) => {
      if (event.code === "ControlLeft") {
        setActiveButton((prevButton) =>
          prevButton === "progress" ? "dashboard" : "progress"
        );
      
      }
    };
    window.addEventListener("keydown", toggleActiveButton);
    return () => {
      window.removeEventListener("keydown", toggleActiveButton);
    };
  }, [activeButton]);
  const [gridApiOutput, setGridApiOutput] = useState(null);
  const onGridReadyOutput = useCallback((params) => {
    setGridApiOutput(params.api);
    if (!loaded && !loading) {
 dispatch(fetchAllSamples());
    }
  }, []);

  useEffect(() => {
    if (gridApiOutput && !loaded && loading) {
      gridApiOutput.showLoadingOverlay();
    }
  }, [ loaded, loading, gridApiOutput]);

  const resetAllFields = () => {
    setSamplePipeline({
      barcode:"",
      department:""
    });
   
    localStorage.setItem(
      "samplePipeline",
      JSON.stringify(samplePipeline)
    );
  };


  const columnDefsInput = [
    { headerName: "Buyer Name", field: "sr_no", sortable: true, filter: true },
    { headerName: "SR Number", field: "season", sortable: true, filter: true },
    {
      headerName: "Delivery Date",
      field: "article_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pair QTY",
      field: "buyer.bsName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Cutting",
      field: "sampleType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Preparation",
      field: "sampleType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Closing",
      field: "sampleType",
      sortable: true,
      filter: true,
    }
    
  ];
  const columnDefsOutput = [
    { headerName: "SR Number", field: "sr_no", sortable: true, filter: true },
    { headerName: "Department", field: "season", sortable: true, filter: true },
    {
      headerName: "Out Date",
      field: "article_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "SR QTY",
      field: "buyer.bsName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer No.",
      field: "sampleType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Article No.",
      field: "sampleType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Color",
      field: "sampleType",
      sortable: true,
      filter: true,
    }
    
  ];

  return (
    <div className={styles.samplePipelineContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>SR Pipeline - Progress View</h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
       
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "progress" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("progress")}
            >
              View Progress
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "dashboard" ? styles.active : ""
              }`}
               onClick={() => {
                  setActiveButton("dashboard");
                  {
                    !isCollapsed && toggleNavbar();
                  }
                }}
            >
              Dashboard View
            </button>
          </div>
       
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "progress" ? (
        <>
          {" "}
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
          
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Date
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={samplePipeline.barcode}
                  name="barcode"
                  onChange={handleSamplePipelineChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Department
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={samplePipeline.department}
                  name="department"
                  onChange={handleSamplePipelineChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Buyer
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={samplePipeline.department}
                  name="department"
                  onChange={handleSamplePipelineChange}
                />
              </div>
              <div className={styles.colSpan}>
               <button className={styles.loadAllButton}>
                Execute
               </button>
              </div>
           
            </div>{" "}
          </div>
            
        <div
        className={isCollapsed ? viewStyles.topContainer : viewStyles.topContainerOpen}
      >
      
          <div
            className={`ag-theme-quartz ${viewStyles.agThemeQuartz}`}
            style={{ height: 500, width: "100%", marginTop: "20px" }}
          >
            <AgGridReact
              columnDefs={columnDefsInput}
              rowData={samples}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
              onGridReady={onGridReadyInput}
            />
          </div>
      </div>
         
        </>
      ) : (
    <div>Dashboard view</div>
      )}
    </div>
  );
};

export default SamplePipelineProgressView;
