import React, { useState, useEffect , useCallback} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import Cross from "../assets/cross.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import Edit3dIcon from "../assets/edit3d.svg";
import SearchIcon from "../assets/search.svg";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DotsIcon from "../assets/exportPrinter.svg";
import FilterIcon from "../assets/filter.svg";
import {  formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewDetails.module.css";
import inputStyles from "../styles/inputDetails.module.css";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";
import { SAMPLE_REQUEST_IMAGE_PATH } from "../features/url";
import styles3 from "../styles/outlinedInput.module.css";

const ViewSr = ({ onSampleSelect,multipleSelected,handleEditClick,handlePrintClick,isEditSelected}) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const { samples, loaded, loading, error } = useSelector(
    (state) => state.sample
  );

  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    if (!loaded && !loading) {
      dispatch(fetchAllSamples());
    }
    const allColumns = params.columnApi.getAllColumns();
    const visibleColumnsState = {};
    allColumns.forEach((col) => {
      const colId = col.getColId();
      visibleColumnsState[colId] = {
        visible: params.columnApi.getColumnState().find((c) => c.colId === colId).hide !== true,
      };
    });
    setVisibleColumns(visibleColumnsState);
  }, [loaded, loading, dispatch]);
  
  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else if (error) {
        gridApi.showNoRowsOverlay();
      } else if (loaded && samples.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, loaded, loading, error, samples]);
  


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
  const onRowSelected = (params) => {
    const selectedData = params.data;
    onSampleSelect(selectedData.length > 0 ? selectedData : null);
  };
  const actionButton = (params) => {
    setIsImagePopup(true);
    setImagePreview(params.data.image_nm)
  };
  const columnDefs = [
    { headerName: "Select",  field:'edit' , maxWidth: 90,  headerCheckboxSelection: true,
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
    // {
    //   headerName: "Username",
    //   field: "username",
    //   sortable: true,
    //   width:130,
    //   filter: true,
    // },
    {
      headerName: "SR Image",
      field: "image_nm",
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        return params.value ? (
       
          <img 
            src={`${SAMPLE_REQUEST_IMAGE_PATH}${params.value}`} 
            alt="Image" 
            style={{ height: '50px', width: '50px' }}
            onClick={() => actionButton(params)}
          />
        ):'No Image';
      },
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
  const exportToExcel = () => {
    if (!gridApi) return;
    const params = {
      fileName: "export.csv",
      allColumns: true,
    };
    gridApi.exportDataAsCsv(params);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleColumnVisibilityChange = (column) => {
    if (!columnApi) return;
    const col = columnApi.getColumn(column);
    const newVisibility = !visibleColumns[column]?.visible;
    columnApi.setColumnVisible(col, !newVisibility);
    setVisibleColumns({
      ...visibleColumns,
      [column]: { ...visibleColumns[column], visible: newVisibility },
    });
  };

  return (
    <><div
    className={isCollapsed ? styles.topContainer : styles.topContainerOpen}
  >
  
  <div className={styles3.tableContainer} style={{ height: '100%', width: '100%',paddingBottom:"60px" }}>
  <div style={{ marginTop: '10px',height:400}} className={`ag-theme-quartz ${styles.agGridWrapper}`}>
    <div className={styles3.header}>
      <div className={styles3.searchContainer}>
        <img src={SearchIcon} className={styles3.searchIcon} alt="Search" />
        <input
          className={styles3.searchInput}
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className={styles3.export}>
        <button
          className={styles3.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={!isEditSelected}
             title="Export"
        >
          <img className={styles3.menuIcon} src={DotsIcon} alt="Menu" />
        </button>
        {isMenuOpen && (
          <div className={styles3.dropdownMenu}>
            <button className={styles3.dropdownItem} onClick={handlePrintClick}>
              <FaFilePdf /> Export to PDF
            </button>
            <button className={styles3.dropdownItem} onClick={exportToExcel}>
              <FaFileExcel /> Export to Excel
            </button>
          </div>
        )}
        <button
          className={styles3.menuButton2}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
             title="Filter"
        >
          <img className={styles3.filterIcon} src={FilterIcon} alt="Filter" />
        </button>
        {isFilterOpen && (
                    <div className={styles3.filterMenu}>
                      {columnDefs.map(
                        (col) =>
                          col.headerName && (
                            <label key={col.field}>
                              <input
                                type="checkbox"
                                checked={!visibleColumns[col.field]?.visible}
                                onChange={() => handleColumnVisibilityChange(col.field)}
                              />
                              {col.headerName}
                            </label>
                          )
                      )}
          </div>
        )}
         <button
          className={styles3.menuButton3}
          //onClick={() => setIsFilterOpen(!isFilterOpen)}
          title="Edit"
          disabled={!multipleSelected}
        >
         <img
            src={Edit3dIcon}
            alt="Edit"
            className={styles3.actionIcon}
            onClick={handleEditClick}
          />
         
        </button>
   
      </div>
    </div>

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
          onSelectionChanged={onRowSelected}
          rowSelection={"multiple"}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading...</span>'
          }
          overlayNoRowsTemplate={
            `<span class="ag-overlay-loading-center">${error ? 'Failed to load data' : 'No data found'}</span>`
          }
        />
  </div>
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
      )}</>
  );
};

export default ViewSr;
