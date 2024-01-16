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

const ItemQuotation = () => {
  const [activeButton, setActiveButton] = useState("details");
  const [itemSelect,setItemSelect] = useState(null);
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [isEditSelected, setIsEditSelected] = useState(false);

  const dispatch = useDispatch();
  const { samples, loaded, loading, error } = useSelector(
    (state) => state.sample
  );

  const handleItemQuotationChange = (e) => {
    const { name, value } = e.target;

    setItemQuotation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [itemQuotation, setItemQuotation] = useState(() => {
    const savedForm = localStorage.getItem("itemQuotation");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          itemName:"",
          supplier:"",
          rate:"",
          unit:"",
          validUntil:"",
        };
  });
  useEffect(() => {
    localStorage.setItem("itemQuotation", JSON.stringify(itemQuotation));
  }, [itemQuotation]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
 dispatch(fetchAllSamples());
    }
  }, []);

  const onRowDataChanged = useCallback(() => {
    if (gridApi) {
      gridApi.hideOverlay();
    }
  }, [gridApi]);

  useEffect(() => {
    if (gridApi && !loaded && loading) {
      gridApi.showLoadingOverlay();
    }
  }, [ loaded, loading, gridApi]);

  const resetAllFields = () => {
    setItemQuotation({
        itemName:"",
        supplier:"",
        rate:"",
        unit:"",
        validUnit:"",
    });
   
    localStorage.setItem(
      "itemQuotation",
      JSON.stringify(itemQuotation)
    );
  };



  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setItemSelect(selectedData.length > 0 ? selectedData[0] : null);
    setIsEditSelected(!isEditSelected);
  };

  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,  checkboxSelection: true },
    { headerName: "Item Name", field: "sr_no", sortable: true, filter: true },
    { headerName: "Supplier", field: "season", sortable: true, filter: true },
    {
      headerName: "Rate (INR)",
      field: "article_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Unit",
      field: "buyer.bsName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Validity of Rate",
      field: "sampleType",
      sortable: true,
      filter: true,
    }
    
  ];


  return (
    <div className={styles.itemQuotationContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Item Quotation </h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Add Item Rates
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
               onClick={() => {
                  setActiveButton("view");
                  {
                    !isCollapsed && toggleNavbar();
                  }
                }}
            >
              View Item Rates
            </button>
          </div>
          {activeButton === "view" && (
              <div className={styles.editContainer}>
                <button
                  disabled={!isEditSelected}
                  className={styles.headButton}
                  
                >
                  Update
                </button>
              </div>
            )}
             </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          {" "}
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Item Name
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.itemName}
                  name="itemName"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Supplier
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.supplier}
                  name="supplier"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Rate
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.rate}
                  name="rate"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Unit
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.unit}
                  name="unit"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                 Valid Until
                </label>
                <input
                  type="date"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.validUntil}
                  name="validUntil"
                  onChange={handleItemQuotationChange}
                />
              </div>
            </div>{" "}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.resetButton} onClick={resetAllFields}>Reset</button>
            <button className={styles.submitButton}>Submit</button>
          </div>
        </>
      ) : (
        
        <div
        className={isCollapsed ? viewStyles.topContainer : viewStyles.topContainerOpen}
      >
      
          <div
            className={`ag-theme-quartz ${viewStyles.agThemeQuartz}`}
            style={{ height: 600, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={samples}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
              onGridReady={onGridReady}
              onSelectionChanged={onRowSelected}
              onRowDataChanged={onRowDataChanged}
            />
          </div>
      </div>
      )}
    </div>
  );
};

export default ItemQuotation;
