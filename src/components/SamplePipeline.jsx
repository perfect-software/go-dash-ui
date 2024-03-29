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

const SamplePipeline = () => {
  const [activeButton, setActiveButton] = useState("input");
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
    { headerName: "SR Number", field: "sr_no", sortable: true, filter: true },
    { headerName: "Department", field: "season", sortable: true, filter: true },
    {
      headerName: "IN Date",
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
          <h1 className={styles.headText}>SR Pipeline</h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
       
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "input" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("input")}
            >
              Input
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "output" ? styles.active : ""
              }`}
               onClick={() => {
                  setActiveButton("output");
                  {
                    !isCollapsed && toggleNavbar();
                  }
                }}
            >
              Output
            </button>
          </div>
       
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "input" ? (
        <>
          {" "}
          <div className={styles.topContainer}>
            <div className={styles.topGridPipline}>
          
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Scan Barcode
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
               <button className={styles.loadAllButton}>
                Load All
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
          <div className={styles.parentButtonContainer}>
          <div className={styles.buttonContainer}>
            <button className={styles.submitButton}>Accept</button>
          </div>
          </div>
        </>
      ) : (
        <>
        {" "}
        <div className={styles.topContainer}>
          <div className={styles.topGridPipline}>
        
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="input1">
                Scan Barcode
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
             <button className={styles.loadAllButton}>
              Load All
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
            columnDefs={columnDefsOutput}
            rowData={samples}
            pagination={true}
            paginationPageSize={12}
            paginationPageSizeSelector={[10, 12, 20, 50, 100]}
            animateRows={true}
            filter={true}
            onGridReady={onGridReadyOutput}
          />
        </div>
    </div>
        <div className={styles.parentButtonContainer}>
        <div className={styles.buttonContainer}>
          <button className={styles.submitButton}>Out</button>
        </div>
        </div>
      </>
      )}
    </div>
  );
};

export default SamplePipeline;
