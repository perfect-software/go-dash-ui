import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import DotsIcon from "../assets/exportPrinter.svg";
import FilterIcon from "../assets/filter.svg";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import styles3 from "../styles/outlinedInput.module.css";

const CustomAgGrid = ({
  rowData,
  pagination,
  setRowData,
  setIsEditing,
  columnDefs,
  gridHeight,
  setFormData,
  editEnabled = true,
  deleteEnabled = true,
  gridOpt=false,
  cellChange=false,
  rowTransferSelect=false,
  onBomSelect,
  cellClicked=false,
  onCellValueChanged
}) => {
  const [filteredData, setFilteredData] = useState(rowData);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({});
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const filtered = rowData.filter((row) => {
      return (
        !searchQuery ||
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, rowData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
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

  const onRowSelected = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRowData(selectedRows);
    rowTransferSelect&&onBomSelect(selectedRows.length > 0 ? selectedRows : null)
  };
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: filteredData,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
    },
    onGridReady: params => {
      setGridApi(params.api);
    },
    context: {
      handleSelectChange: (id, checked) => {
        const rowNode = gridApi.getRowNode(id);
        if (rowNode) {
          const newRowData = { ...rowNode.data };
          newRowData.select = checked;
          rowNode.setRowData(newRowData);
          setFilteredData(prevData => prevData.map(item => item.ticketNo === newRowData.ticketNo ? newRowData : item));
        }
      }
    }
  };
  const onCellClicked = (event) => {
    if (event.column.getColId() !== 'delDate' && event.column.getColId() !== 'rate') {
      let node = event.node;
      node.setSelected(!node.isSelected());
    }
    
  };
  const handleEdit = () => {
    if (selectedRowData.length === 1) {
      setIsEditing(true);
      const selectedRow = selectedRowData[0];
      setFormData(selectedRow);
    } else {
      alert("Please select exactly one row to edit.");
    }
  };

  const handleDelete = () => {
    const updatedRowData = rowData.filter((item) =>
      !selectedRowData.some((selected) => selected.id === item.id)
    );
    setRowData(updatedRowData);
    if (updatedRowData.length === 0) {
      setRowData([]);
    }
  };
  

  const exportToPDF = () => {
    if (!gridApi || !columnApi) return;
  
    const allColumns = columnApi.getColumns();
    const visibleColumns = allColumns.filter(
      col => !columnApi.getColumnState().find(state => state.colId === col.getColId()).hide
    );
  
    // Exclude the column with field 'select'
    const filteredColumns = visibleColumns.filter(col => col.getColDef().field !== 'select');
  
    const headers = filteredColumns.map(col => col.getColDef().headerName);
    const rowData = [];
  
    gridApi.forEachNode(node => {
      const row = {};
      filteredColumns.forEach(col => {
        const field = col.getColDef().field;
        row[field] = node.data[field];
      });
      rowData.push(row);
    });
  
    const doc = new jsPDF();
    doc.autoTable({
      head: [headers],
      body: rowData.map(row => filteredColumns.map(col => row[col.getColDef().field])),
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
    <div className={styles3.tableContainer} style={{ height: "100%", width: "100%", paddingBottom: "60px" }}>
      <div style={{ marginTop: "10px", height: gridHeight }} className={`ag-theme-quartz ${styles.agGridWrapper}`}>
        <div className={styles3.header}>
          <div className={styles3.searchContainer}>
            <input
              className={styles3.searchInput}
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles3.export}>
            <button className={styles3.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
            <button className={styles3.menuButton2} onClick={() => setIsFilterOpen(!isFilterOpen)}>
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
            {editEnabled && (
              <button className={styles3.menuButton3} onClick={handleEdit} disabled={!(selectedRowData && selectedRowData.length === 1)}>
                <img src={Edit3dIcon} alt="Edit" className={styles3.actionIcon} />
              </button>
            )}
            {deleteEnabled && (
              <button className={styles3.menuButton4} onClick={handleDelete} disabled={!(selectedRowData && selectedRowData.length > 0)}>
                <img src={Delete3dIcon} alt="Delete" className={styles3.actionIcon} />
              </button>
            )}
          </div>
        </div>

        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          pagination={pagination&&pagination}
          animateRows={true}
          rowSelection="multiple"
          onSelectionChanged={onRowSelected}
          paginationPageSize={10}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
          gridOptions={gridOpt&&gridOptions} 
          onCellClicked={cellClicked&onCellClicked}
          onCellValueChanged= {cellChange&&onCellValueChanged}
        />
      </div>
    </div>
  );
};

export default CustomAgGrid;
