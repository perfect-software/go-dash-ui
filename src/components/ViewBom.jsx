import React, { useState, useEffect , useCallback} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import Cross from "../assets/cross.svg";
import {  formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewDetails.module.css";
import inputStyles from "../styles/inputDetails.module.css";
import { fetchAllBom } from "../reducer/bomSlice";
import { useDispatch, useSelector } from "react-redux";
import { SAMPLE_REQUEST_IMAGE_PATH } from "../features/url";
import BomDetailsPopup from "../popups/BomDetailsPopup";


const ViewBom = ({onBOMSelect}) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [bomDetailsPopup,setBomDetailsPopup] = useState(false);
  const dispatch = useDispatch();
  const [bomId, setBomId] = useState('');
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const { bom, loaded, loading, error } = useSelector(
    (state) => state.bom
  );

  const [gridApi, setGridApi] = useState(null);

  
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllBom());
    }
  }, [loaded, loading, dispatch]);
  
  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else if (error) {
        gridApi.showNoRowsOverlay();
      } else if (loaded && bom.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, loaded, loading, error, bom]);
  


  const dateFilterParams = {
    comparator: function(filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    }
  };

  const onCellKeyDown = useCallback((e) => {
  
    if (!e.event) {
      return;
    }
    const keyboardEvent = e.event;
    const key = keyboardEvent.key;
    if (key.length) {
     
      if (key === 'Enter') {
        var rowNode = e.node;
        var newSelection = !rowNode.isSelected();
       
        rowNode.setSelected(newSelection);
      }
    }
  }, []);
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onBOMSelect(selectedData.length > 0 ? selectedData : null);
  };
 
  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,
    checkboxSelection: true,
    showDisabledCheckboxes: true},
    { headerName: "SR No.", width:150, field: "srno", sortable: true, filter: true },
    {
      headerName: "BOM Type",
      field: "bomType",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "BOM Status",
      field: "bomStatus",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Created By",
      field: "createdBy",
      sortable: true,
      width:125,
      filter: true,
    },
    {
      headerName: "Approved By",
      field: "bomApprovedBy",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Date",
      field: "entDate",
      sortable: true,
      width:140,
      filter: true,
    },
    {
        headerName: "BOM Details",
        field:'bomId',
        width:120,
        cellRenderer: function (params) {
          return (
            <div style={{
              height: '100%', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center' 
            }}>
              <button className={styles.viewButton}
                onClick={() => actionButton(params.value)}
              >
                View{" "}
              </button>
            </div>
          );
        },
  
     
      },
  ];
 
  const actionButton = (params) => {
     setBomDetailsPopup(true);
     setBomId(params);
    console.log(params);
  };
  return (
    <><div
    className={isCollapsed ? styles.topContainer : styles.topContainerOpen}
  >
  
      <div
        className={`ag-theme-quartz ${styles.agThemeQuartz}`}
        style={{ height: 500, width: "100%", marginTop: "10px" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={bom}
          pagination={true}
          paginationPageSize={12}
          paginationPageSizeSelector={[10, 12, 20, 50, 100]}
          animateRows={true}
          filter={true}
          onCellKeyDown={onCellKeyDown}
          onGridReady={onGridReady}
          onSelectionChanged={onRowSelected}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            `<span class="ag-overlay-loading-center">${error ? 'Failed to load data' : 'No data found'}</span>`
          }
        />
      </div>
  </div>
      {isImagePopup && (
        <div className={inputStyles.popupOverlay}>
          <div className={inputStyles.imagePopupContent}>
            <img
              src={`${SAMPLE_REQUEST_IMAGE_PATH}${imagePreview}`}
              className={inputStyles.imagepreviewPopup}
              alt=""
            />
            <img
              onClick={() => {
                setIsImagePopup(false);
              }}
              src={Cross}
              alt="Select Icon"
              className={inputStyles.crossIcon}
            />
          </div>
        </div>
      )}
 {bomDetailsPopup && (<BomDetailsPopup bomId={bomId && bomId} onCancel={()=> setBomDetailsPopup(false)} />)}
      </>
  );
};

export default ViewBom;
