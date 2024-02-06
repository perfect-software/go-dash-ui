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
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";


const ViewSr = ({ onSampleSelect }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const { samples, loaded, loading, error } = useSelector(
    (state) => state.sample
  );

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
   
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllSamples());
    }
    params.api.ensureIndexVisible(0);
    params.api.setFocusedCell(0, columnDefs[0].field);
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
    onSampleSelect(selectedData.length > 0 ? selectedData : null);
  };
  const actionButton = (params) => {
    setIsImagePopup(true);
    setImagePreview(params.data.image_nm)
  };
  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,  headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true},
    { headerName: "SR No.", width:150, field: "sr_no", sortable: true, filter: true },
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
      headerName: "Username",
      field: "buyer.username",
      sortable: true,
      width:200,
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
      headerName: "Article No",
      field: "articleName",
      sortable: true,
      width:125,
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
    { headerName: "Sample Type",  width:150, field: "sampleType", sortable: true, filter: true },

    { headerName: "Season", width:110, field: "season", sortable: true, filter: true },
    {
      headerName: "Image",
      field: "image_nm",
      width: 125,
      filter: true,
      cellRenderer: (params) => {
        return params.value ? (
       
          <img 
            src={`http://localhost:8081/images/${params.value}`} 
            alt="Image" 
            style={{ height: '50px', width: '50px' }}
            onClick={() => actionButton(params)}
          />
        ) : null;
      },
    },
    { headerName: "Sample Refrence", width:170, field: "sampleRef", sortable: true, filter: true },
    {
      headerName: "Buyer Article",
      field: "buyerArticle",
      sortable: true,
      width:150,
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
      headerName: "Financial Year",
      field: "finYear",
      width:150,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Ref",
      field: "internal_ref",
      width:200,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Leather Remark",
      field: "leather_remark",
      width:200,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Sole Remark",
      field: "sole_remark",
      width:200,
      sortable: true,
      filter: true,
    },
  ];


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
          rowData={samples}
          pagination={true}
          paginationPageSize={12}
          paginationPageSizeSelector={[10, 12, 20, 50, 100]}
          animateRows={true}
          filter={true}
          onCellKeyDown={onCellKeyDown}
          onGridReady={onGridReady}
          rowSelection={"multiple"}
          onSelectionChanged={onRowSelected}
          onRowDataChanged={onRowDataChanged}
        />
      </div>
  </div>
      {isImagePopup && (
        <div className={inputStyles.popupOverlay}>
          <div className={inputStyles.imagePopupContent}>
            <img
              src={`http://localhost:8081/images/${imagePreview}`}
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
      )}</>
  );
};

export default ViewSr;
