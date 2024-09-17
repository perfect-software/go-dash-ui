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
import CustomAgGridSecond from "../features/CustomAgGridSecond";

const ViewBuyer = ({onBuyerSelect,handlePrintClick}) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const { buyers, loaded, loading, error } = useSelector(
    (state) => state.buyer
  );

  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBuyers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteSample(id));
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
      headerName: "Select",
      field: "select",
      maxWidth: 100,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
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
    <div>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error loading data: {error}</p>
    ) : (
      <CustomAgGridSecond
        columnDefs={columnDefs}
        rowData={buyers}
        handleDelete={handleDelete}
        handlePrintClick={handlePrintClick}
        onRowSelect={onRowSelected}
        deleteEnabled={false}
        editEnabled={false}
        pagination={true}
      />
    )}
  </div>
  );
};

export default ViewBuyer;
