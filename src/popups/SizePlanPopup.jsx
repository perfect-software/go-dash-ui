import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import inputStyles from "../styles/inputDetails.module.css";
import tableStyles from "../styles/bom.module.css";
import Cross from "../assets/cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItemRates } from "../reducer/itemRateSlice";

const SizePlanPopup = ({ onCancel, onSubmitSizeData }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rowSelect, setRowSelect] = useState(false);
  const dispatch = useDispatch();

  const [sizePlans, setSizePlans] = useState([
    { code: "L1", from: "23", to: "34", midSize: 50 },
    { code: "L2", from: "56", to: "44", midSize: 70 },
   
  ]);

  const [newItem, setNewItem] = useState({
    code: "",
    from: "",
    to: "",
    midSize: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    setSizePlans([...sizePlans, { ...newItem }]);
    setNewItem({ code: "", from: "", to: "", midSize: "" });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...sizePlans];
    newItems.splice(index, 1);
    setSizePlans(newItems);
  };

  //   const { sizePlans, loaded, loading, error } = useSelector(
  //     (state) => state.itemRate
  //   );

  //   const [gridApi, setGridApi] = useState(null);

  //   const onGridReady = useCallback((params) => {
  //     setGridApi(params.api);
  //     if (!loaded && !loading) {
  //       dispatch(fetchAllItemRates());
  //     }
  //   }, []);

  //   const onRowDataChanged = useCallback(() => {
  //     if (gridApi) {
  //       gridApi.hideOverlay();
  //     }
  //   }, [gridApi]);

  //   useEffect(() => {
  //     if (gridApi && !loaded && loading) {
  //       gridApi.showLoadingOverlay();
  //     }
  //   }, [loaded, loading, gridApi]);

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
  const columnDefs = [
    {
      headerName: "Select",
      field: "edit",
      maxWidth: 100,
      checkboxSelection: true,
    },
    { headerName: "Code", field: "code", sortable: true, filter: true },
    { headerName: "From", field: "from", sortable: true, filter: true },
    { headerName: "To", field: "to", sortable: true, filter: true },
    {
      headerName: "Mid Size",
      field: "midSize",
      sortable: true,
      filter: true,
    },
    {
      field: "action",
      headerName: "Action",
      cellStyle: { textAlign: "center" },
      cellRenderer: (params) => (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className={tableStyles.minus}
            onClick={() => handleRemoveItem(params.rowIndex)}
          ></button>
        </div>
      ),
    },
  ];
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setRowSelect(selectedData.length > 0);
    setSelectedSize(selectedData);
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Size Plan For Grading</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
            <div className={inputStyles.topGrid}>
              <div className={inputStyles.colSpan}>
                <label className={inputStyles.sampleLabel} htmlFor="code">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={newItem.code}
                  onChange={handleInputChange}
                  placeholder="Code"
                  className={inputStyles.basicInput}
                />
              </div>
              <div className={inputStyles.colSpan}>
                <label className={inputStyles.sampleLabel}>Range</label>
                <div className={inputStyles.rangeInputs}>
                  {" "}
                  <input
                    type="number"
                    name="from"
                    value={newItem.from}
                    onChange={handleInputChange}
                    placeholder="From"
                    className={inputStyles.basicInput}
                  />
                  <span> - </span>
                  <input
                    type="number"
                    name="to"
                    value={newItem.to}
                    onChange={handleInputChange}
                    placeholder="To"
                    className={inputStyles.basicInput}
                  />
                </div>
              </div>
              <div className={inputStyles.colSpan}>
                <label className={inputStyles.sampleLabel} htmlFor="midSize">
                  Mid Size
                </label>
                <input
                  type="text"
                  name="midSize"
                  value={newItem.midSize}
                  onChange={handleInputChange}
                  placeholder="Mid Size"
                  className={inputStyles.basicInput}
                />
              </div>
              <div className={inputStyles.colSpan}>
                <button onClick={handleAddItem} className={tableStyles.addBtn}>
                  ADD
                </button>
              </div>
            </div>
          </div>

          <div
            className={`ag-theme-quartz ${styles.agThemeQuartz}`}
            style={{ height: 600, width: "100%", marginTop: "5px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={sizePlans}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
            // onGridReady={onGridReady}
            //  onSelectionChanged={onRowSelected}
            // onRowDataChanged={onRowDataChanged}
            onRowSelected={onRowSelected}
            />
          </div>
          <div className={styles.bottomButtonContainer}>
            <button
              disabled={!rowSelect}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitSizeData(selectedSize);
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default SizePlanPopup;
