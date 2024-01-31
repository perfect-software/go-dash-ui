import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/viewBuyer.module.css";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { useDispatch, useSelector } from "react-redux";

const ViewBuyer = ({onBuyerSelect}) => {
  const navigate = useNavigate();
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

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    onBuyerSelect(selectedData.length > 0 ? selectedData : null);
  };
  const columnDefs = [
    {
      headerName: "Print",
      field: "print",
      maxWidth: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    { headerName: "Buyer Code",width:135, field: "bsCode", sortable: true, filter: true },
    { headerName: "Buyer", width:300, field: "bsName", sortable: true, filter: true },
    { headerName: "Buyer Abbreviation", field: "bsAbbreviation", sortable: true, filter: true },
    {
      headerName: "Billing Address",
      field: "billingAddress",
      sortable: true,
      width:300,
      filter: true,
    },
    {
      headerName: "Delivery Address",
      field: "deliveryAddress",
      sortable: true,
      width:300,
      filter: true,
    },

    {
      headerName: "City",
      field: "city",
      sortable: true,
      width:120,
      filter: true,
    },
    {
      headerName: "Pincode",
      field: "pincode",
      width:120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Country",
      field: "country",
      width:120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Currency",
      field: "currency",
      sortable: true,
      width:120,
      filter: true,
    },
    {
      headerName: "Contact Person",
      field: "contactPerson",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "MobileExt",
      field: "mobileExt",
      width:120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      width:200,
      sortable: true,
      filter: true,
    },
  
    {
      headerName: "User Name",
      field: "username",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      width:140,
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
  );
};

export default ViewBuyer;
