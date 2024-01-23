import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import viewStyles from "../styles/viewDetails.module.css";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { useDispatch, useSelector } from "react-redux";
import PurchaseOrderPopup from "../popups/PurchaseOrderPopup";

const PurchaseOrder = () => {
  const [activeButton, setActiveButton] = useState("input");
  const [purchasePopup,setIsPurchasePopup]=useState(false);
  const handlePurchaseOrderChange = (e) => {
    const { name, value } = e.target;

    setPurchaseOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [purchaseOrder, setPurchaseOrder] = useState(() => {
    const savedForm = localStorage.getItem("purchaseOrder");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          barcode:"",
          department:""
        };
  });
  useEffect(() => {
    localStorage.setItem("purchaseOrder", JSON.stringify(purchaseOrder));
  }, [purchaseOrder]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const { buyers, loaded, loading, error } = useSelector(
    (state) => state.buyer
  );

  const [gridApi, setGridApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllBuyers());
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
  }, [loaded, loading, gridApi]);


  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      console.log(filterLocalDateAtMidnight);
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    },
  };
  const resetAllFields = () => {
    setPurchaseOrder({
      barcode:"",
      department:""
    });
   
    localStorage.setItem(
      "purchaseOrder",
      JSON.stringify(purchaseOrder)
    );
  };
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onBuyerSelect(selectedData.length > 0 ? selectedData : null);
  };

  const columnDefs = [
    {
      headerName: "Select",
      field: "select",
      maxWidth: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },

    { headerName: "Buyer", field: "bsName", sortable: true, filter: true },
   
    {
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    { headerName: "Buyer Code", field: "bsCode", sortable: true, filter: true },
    {
      headerName: "Delivery Address",
      field: "deliveryAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Billing Address",
      field: "billingAddress",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className={styles.purchaseOrderContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer2}>
          <h1 className={styles.headText}>Purchase Order</h1>
        </div>
       
        <div className={styles.subHeadContainerTwo}>
            <div className={styles.subHeadContainerThree}>
              <h2>Purchase Order</h2>
              <button
                className={styles.headButton2}
                onClick={() => setIsPurchasePopup(true)}
              >
                Add Material
              </button>
            </div>

            <div className={styles.headBorder}></div>
          </div>
        
      </div>


          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
          
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                 PO Date
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={purchaseOrder.barcode}
                  name="barcode"
                  onChange={handlePurchaseOrderChange}
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
                  value={purchaseOrder.department}
                  name="department"
                  onChange={handlePurchaseOrderChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                 Type
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={purchaseOrder.department}
                  name="department"
                  onChange={handlePurchaseOrderChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                Currency
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={purchaseOrder.department}
                  name="department"
                  onChange={handlePurchaseOrderChange}
                />
              </div>
            </div>
          </div>
            
        <div
        className={isCollapsed ? viewStyles.topContainer : viewStyles.topContainerOpen}
      >
      
          <div
            className={`ag-theme-quartz ${viewStyles.agThemeQuartz}`}
            style={{ height: 500, width: "100%", marginTop: "20px" }}
          >
            <AgGridReact
          columnDefs={columnDefs}
          rowData={buyers}
          pagination={true}
          paginationPageSize={12}
          paginationPageSizeSelector={[10, 12, 20, 50, 100]}
          animateRows={true}
          filter={true}
          onGridReady={onGridReady}
          rowSelection={"multiple"}
          onSelectionChanged={onRowSelected}
          onRowDataChanged={onRowDataChanged}
        />
          </div>
      </div>
       
      {purchasePopup && (
            <PurchaseOrderPopup
              onCancel={() => {
                setIsPurchasePopup(false);
              }}
             // onSubmitBuyerData={handleBuyerSubmit}
            />
          )}
    </div>
  );
};

export default PurchaseOrder;
