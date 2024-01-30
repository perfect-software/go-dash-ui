import React, { useState, useEffect , useCallback} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import {  formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewDetails.module.css";
import { fetchAllSamples } from "../reducer/sampleSlice";
import { useDispatch, useSelector } from "react-redux";


const ViewSr = ({ onSampleSelect }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
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
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onSampleSelect(selectedData.length > 0 ? selectedData[0] : null);
  };

  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,  checkboxSelection: true },
    { headerName: "SR No.", field: "sr_no", sortable: true, filter: true },
    { headerName: "Season", field: "season", sortable: true, filter: true },
    { headerName: "Sample Refrence", field: "sampleRef", sortable: true, filter: true },
    { headerName: "Sample Type", field: "sampleType", sortable: true, filter: true },
    {
      headerName: "Article No",
      field: "article_no",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer Article",
      field: "buyerArticle",
      sortable: true,
      filter: true,
    },
    
    {
      headerName: "Buyer",
      field: "buyer.bsName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Financial Year",
      field: "finYear",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Size",
      field: "size",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pair",
      field: "pair",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Upper Color",
      field: "upperColor",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Lining Color",
      field: "liningColor",
      sortable: true,
      filter: true,
    },
    { headerName: "Last", field: "last", sortable: true, filter: true },
    { headerName: "Insole", field: "insole", sortable: true, filter: true },
    {
      headerName: "Sole Label",
      field: "soleLabel",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Socks",
      field: "socks",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Heel",
      field: "heel",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Pattern",
      field: "pattern",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Buyer Refrence",
      field: "buyerRef",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Upper Leather",
      field: "inUpperLeather",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Socks",
      field: "inSocks",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Quantity",
      field: "inQuantity",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Internal Lining",
      field: "inLining",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Date of Order",
      field: "dateOfOrder",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "Delivery Date",
      field: "deliveryDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "ProdEx Date",
      field: "prodExDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },

  ];


  return (
    <div
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
            onGridReady={onGridReady}
            onSelectionChanged={onRowSelected}
            onRowDataChanged={onRowDataChanged}
          />
        </div>
    </div>
  );
};

export default ViewSr;
