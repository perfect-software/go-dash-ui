import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Delete3dIcon from "../assets/delete3d.svg";
import Edit3dIcon from "../assets/edit3d.svg";
import SearchIcon from "../assets/search.svg";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DotsIcon from "../assets/exportPrinter.svg";
import FilterIcon from "../assets/filter.svg";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import styles2 from "../styles/newPo.module.css";
import styles3 from "../styles/outlinedInput.module.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
const WorkMasterViewPopup = ({ onClose, setFormData }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [jobLeft, setJobLeft] = useState("");
  const [karigarGroup, setKarigarGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [contractor, setContractor] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  

  const rowData = [
    // Example row data (can be replaced with actual data)
    {
      id: 1,
      jobLeft: 'Yes',
      karigarName: 'John Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group A',
      department: 'Dept 1'
    },
    {
      id: 2,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 3,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 4,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 5,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 6,
      jobLeft: 'No',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
 
  ];

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'Select',
      field: 'select',
      width: 110,
    },
    { headerName: 'Job Left', field: 'jobLeft', width: 100, },
    { headerName: 'Karigar Name', field: 'karigarName', width: 150, },
    { field: 'contractorName', headerName: 'Contractor Name', width: 150, },
    { field: 'mobileNo', headerName: 'Mobile No.', width: 130, },
    { field: 'aadharNo', headerName: 'Aadhar No.', width: 150, },
    { field: 'panNo', headerName: 'PAN No.', width: 150, },
    { field: 'bankName', headerName: 'Bank Name', width: 150, },
    { field: 'bankAccNo', headerName: 'Bank A/C No.', width: 150, },
    { field: 'gstNo', headerName: 'GST No.', width: 150, },
    { field: 'karigarGroup', headerName: 'Karigar Group', width: 150, },
    { field: 'department', headerName: 'Department', width: 150, },
  ];

  useEffect(() => {
    const filtered = rowData.filter((row) => {
      return (
        (!jobLeft || row.jobLeft.toLowerCase().includes(jobLeft.toLowerCase())) &&
        (!karigarGroup || row.karigarGroup.toLowerCase().includes(karigarGroup.toLowerCase())) &&
        (!department || row.department.toLowerCase().includes(department.toLowerCase())) &&
        (!contractor || row.contractorName.toLowerCase().includes(contractor.toLowerCase())) &&
        (!searchQuery ||
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );
    });

    setFilteredData(filtered);
  }, [jobLeft, karigarGroup, department, contractor, searchQuery]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);

    // Initialize visible columns
    const allColumns = params.columnApi.getAllColumns();
    const visibleColumnsState = {};
    allColumns.forEach((col) => {
      const colId = col.getColId();
      visibleColumnsState[colId] = {
        visible: params.columnApi.getColumnState().find((c) => c.colId === colId).hide !== true,
      };
    });
    setVisibleColumns(visibleColumnsState);
  };

  const [selectedRowData, setSelectedRowData] = useState(null);

  const onRowSelected = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRowData(selectedRows);

  };

  const handleEdit = () => {
    if (selectedRowData.length == 1) {
      
      const selectedRow = selectedRowData[0];
      setFormData(selectedRow); 
    onClose();
    } else {
      alert('Please select exactly one row to edit.');
    }
  };
  const handleDelete = () => {
    if (!gridApi) {
      console.error('Grid API is not initialized.');
      return;
    }
  
    if (selectedRowData && selectedRowData.length > 0) {
      
      const updatedRowData = filteredData.filter((item) => 
        !selectedRowData.some((selected) => selected.id === item.id)
      );
  
    
      setFilteredData(updatedRowData);
  
    
      gridApi.setRowData(updatedRowData);
    }
  };
  

  

  

  const exportToPDF = () => {
    if (!gridApi || !columnApi) return;
    const allColumns = columnApi.getColumns();
    const visibleColumns = allColumns.filter(col => columnApi.getColumnState().find(state => state.colId === col.getId()).hide === false);
    const headers = visibleColumns.map(col => col.getColDef().headerName);
    const rowData = [];
    gridApi.forEachNode((node) => {
      const row = {};
      visibleColumns.forEach(col => {
        const field = col.getColDef().field;
        row[field] = node.data[field];
      });
      rowData.push(row);
    });
  
    const doc = new jsPDF();
    doc.autoTable({
      head: [headers],
      body: rowData.map(row => visibleColumns.map(col => row[col.getColDef().field])),
    });
    doc.save("TableData.pdf");
  };
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
        >
          <img className={styles3.menuIcon} src={DotsIcon} alt="Menu" />
        </button>
        {isMenuOpen && (
          <div className={styles3.dropdownMenu}>
            <button className={styles3.dropdownItem} onClick={exportToPDF}>
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
          onClick={handleEdit}
          disabled={selectedRowData&&selectedRowData.length !== 1}
        >
         <img
            src={Edit3dIcon}
            alt="Edit"
            className={styles3.actionIcon}
        
          />
         
        </button>
        <button
          className={styles3.menuButton4}
          onClick={handleDelete}
          disabled={selectedRowData&&selectedRowData.length == 0}
        >
          <img
            src={Delete3dIcon}
            alt="Delete"
            className={styles3.actionIcon}
          
          />
        </button>
      </div>
    </div>

    <AgGridReact
      rowData={filteredData}
      columnDefs={columnDefs}
      onGridReady={onGridReady}
      pagination={true}
      animateRows={true}
      rowSelection="multiple"
      onSelectionChanged={onRowSelected}
      paginationPageSize={10}
    
      defaultColDef={{
        sortable: true,
        resizable: true,
        filter: true,
      
      }}
    />
 
</div>

        
        
        </div>
  
  );
};

export default WorkMasterViewPopup;
