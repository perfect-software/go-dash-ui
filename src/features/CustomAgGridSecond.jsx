import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import DotsIcon from "../assets/exportPrinter.svg";
import FilterIcon from "../assets/filter.svg";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import styles from "../styles/popupTable.module.css";
import styles3 from "../styles/outlinedInput.module.css";

const CustomAgGridSecond = ({
  columnDefs,
  rowData,
  gridHeight = "500px",
  pagination = true,
  paginationPageSize = 10,
  editEnabled = false,
  deleteEnabled = false,
  handleEditClick,
  handleDelete,
  onRowSelect,
  handlePrintClick
}) => {
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [selectedRowData, setSelectedRowData] = useState([]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    gridApi.setQuickFilter(e.target.value);
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


  const exportToExcel = () => {
    if (!gridApi) return;
    const params = {
      fileName: "export.csv",
      allColumns: true,
    };
    gridApi.exportDataAsCsv(params);
  };
  const onSelectionChanged = () => {
    const selectedData = gridApi.getSelectedRows();
    setSelectedRowData(selectedData);
  };
  return (
    <div
      className={styles3.tableContainer}
      style={{ height: "100%", width: "100%", paddingBottom: "60px" }}
    >
      <div
        style={{ marginTop: "10px", height: gridHeight }}
        className={`ag-theme-quartz ${styles.agGridWrapper}`}
      >
        <div className={styles3.header}>
          <div className={styles3.searchContainer}>
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
                <button className={styles3.dropdownItem}  onClick={handlePrintClick}>
                  <FaFilePdf /> Export to PDF
                </button>
                <button
                  className={styles3.dropdownItem}
                  onClick={exportToExcel}
                >
                  <FaFileExcel /> Export to Excel
                </button>
              </div>
            )}
            <button
              className={styles3.menuButton2}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <img
                className={styles3.filterIcon}
                src={FilterIcon}
                alt="Filter"
              />
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
            {editEnabled  && (
              <button className={styles3.menuButton3} onClick={handleEditClick} disabled={selectedRowData?.length != 1}>
                <img
                  src={Edit3dIcon}
                  alt="Edit"
                  className={styles3.actionIcon}
                />
              </button>
            )}
            {deleteEnabled && (
              <button className={styles3.menuButton4} onClick={handleDelete} disabled={!selectedRowData?.length > 0}>
                <img
                  src={Delete3dIcon}
                  alt="Delete"
                  className={styles3.actionIcon}
                />
              </button>
            )}
          </div>
        </div>

        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          onRowSelected={onRowSelect}
          onSelectionChanged={onSelectionChanged} 
          onGridReady={onGridReady}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};

export default CustomAgGridSecond;
