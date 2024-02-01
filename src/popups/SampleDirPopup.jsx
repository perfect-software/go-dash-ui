import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/sampleDirPopup.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
import { formatDDMMYYYYDate } from "../features/convertDate";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";

const SampleDirPopup = ({ onCancel, onSubmitSampleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedSample, setSelectedSample] = useState(null);
  const [rowSelect , setRowSelect]= useState(false);
  const dispatch = useDispatch();
  const { samples, loaded, loading, error } = useSelector(
    (state) => state.sample
  );

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
  }, [loaded, loading, gridApi]);

  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      console.log(formattedFilterDate);
      console.log(formattedCellValue);
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    },
  };

  const columnDefs = [
    {headerName: "Select",field:'select', maxWidth: 80, checkboxSelection: true  },
    { headerName: "SR No.", width:150, field: "sr_no", sortable: true, filter: true },
    { headerName: "Season", width:110, field: "season", sortable: true, filter: true },
    { headerName: "Sample Refrence", width:170, field: "sampleRef", sortable: true, filter: true },
    { headerName: "Sample Type",  width:150, field: "sampleType", sortable: true, filter: true },
    {
      headerName: "Article No",
      field: "articleNo",
      sortable: true,
      width:125,
      filter: true,
    },
    {
      headerName: "Article Name",
      field: "articleName",
      sortable: true,
      width:125,
      filter: true,
    },

    {
      headerName: "Buyer Article",
      field: "buyerArticle",
      sortable: true,
      width:150,
      filter: true,
    },
    
    {
      headerName: "Buyer",
      field: "buyer.bsName",
      sortable: true,
      width:300,
      filter: true,
    },

    {
      headerName: "Size",
      field: "size",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: true,
      width:120,
      filter: true,
    },
    {
      headerName: "Pair",
      field: "pair",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Upper Color",
      field: "upperColor",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Lining Color",
      field: "liningColor",
      sortable: true,
      width:140,
      filter: true,
    },
    { headerName: "Last", width:140, field: "last", sortable: true, filter: true },
    { headerName: "Insole", width:140, field: "insole", sortable: true, filter: true },
    {
      headerName: "Sole Label",
      field: "soleLabel",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Socks",
      field: "socks",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Heel",
      field: "heel",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Pattern",
      field: "pattern",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer Refrence",
      field: "buyerRef",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Upper Leather",
      field: "inUpperLeather",
      width:160,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Lining",
      field: "inLining",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Internal Socks",
      field: "inSocks",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Internal Quantity",
      field: "inQuantity",
      sortable: true,
      width:180,
      filter: true,
    },
    {
      headerName: "Comments",
      field: "comments",
      width:250,
      sortable: true,
      filter: true,
    },
    
    {
      headerName: "Delivery Date",
      field: "deliveryDate",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "ProdEx Date",
      field: "prodExDate",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Date of Order",
      field: "dateOfOrder",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Financial Year",
      field: "finYear",
      width:150,
      sortable: true,
      filter: true,
    },
  ];

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setRowSelect(selectedData.length > 0);
    setSelectedSample(selectedData);
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.sampleDirPopupContainer}>
          <div className={styles.topsampleDirPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Sample Directory</h1>
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
          </div>

          <div
            className={`ag-theme-quartz ${styles.agThemeQuartz}`}
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

          <div className={styles.bottomSampleButtonContainer}>
            <button
              disabled={!rowSelect}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitSampleData(selectedSample);
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

export default SampleDirPopup;
