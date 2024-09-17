import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../styles/outlinedInput.module.css";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import Delete3dIcon from "../assets/delete3d.svg";
import Edit3dIcon from "../assets/edit3d.svg";
import SearchIcon from "../assets/search.svg";
import SortIcon from "../assets/sort.svg";
import DotsIcon from "../assets/dots.svg";
import FilterIcon from "../assets/filter.svg";
import * as XLSX from "xlsx";
import { useSidebar } from "../context/SidebarContext";
import jsPDF from "jspdf";
import ReactPaginate from "react-paginate";
import "jspdf-autotable";

const getNestedValue = (obj, path) => {
  if (!path) return '';
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : ''), obj);
};


const AutoTable = ({
  data,
  setData,
  columns,
  canEdit,
  canDelete,
  setFormData,
  setIsEditing,
  setEditIndex,
  tableHeight,

  selectedRows,
  setSelectedRows

}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 12;
  const { isCollapsed } = useSidebar();
  const tableRef = useRef(null);
  const EmptyTableHeight = tableHeight ? `calc(${tableHeight} + 20px)` : '300px';
  useEffect(() => {
    const initialColumns = {};
    Object.keys(columns).forEach((key) => {
      initialColumns[key] = {
        visible: columns[key].visible !== false,
        width: columns[key].width || "auto",
      };
    });
    setVisibleColumns(initialColumns);
  }, [columns]);

  useEffect(() => {
    if (tableRef.current) {
      const resizableColumns = tableRef.current.querySelectorAll(
        "th[data-resizable-column-id]"
      );
      resizableColumns.forEach((col) => {
        const existingResizer = col.querySelector(`.${styles.resizer}`);
        if (existingResizer) {
          col.removeChild(existingResizer);
        }
        const resizer = document.createElement("div");
        resizer.className = styles.resizer;
        col.appendChild(resizer);
        resizer.addEventListener("mousedown", function (e) {
          const columnIndex = Array.from(col.parentNode.children).indexOf(col);
          handleMouseDown(e, columnIndex);
        });
      });
    }
  }, [columns, data, visibleColumns]);
  

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteRow = (index) => {
    setDeleting(index);
    setTimeout(() => {
      const updatedData = [...data];
      updatedData.splice(index, 1);
      setData(updatedData);
      setDeleting(null);
    }, 1000);
  };

  const handleMouseDown = (e, columnIndex) => {
    e.preventDefault();
    document.body.classList.add(styles.noSelect);
  
    const startX = e.clientX;
    const startWidth =
      tableRef.current.querySelectorAll("th")[columnIndex].offsetWidth;
    const tableRows = tableRef.current.querySelectorAll("tr");
  
    const handleMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      tableRef.current.querySelectorAll("th")[
        columnIndex
      ].style.width = `${newWidth}px`;
      tableRows.forEach((row) => {
        const cells = row.querySelectorAll("th, td");
        cells[columnIndex].style.width = `${newWidth}px`;
      });
    };
  
    const handleMouseUp = () => {
      document.body.classList.remove(styles.noSelect);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        Object.keys(visibleColumns).filter(
          (column) => visibleColumns[column].visible
        ),
      ],
      body: data.map((row) =>
        Object.keys(visibleColumns)
          .filter((column) => visibleColumns[column].visible)
          .map((key) => getNestedValue(row, columns[key].path))
      ),
    });
    doc.save("TableData.pdf");
  };

  const exportToExcel = () => {
    const filteredData = data.map((row) => {
      const filteredRow = {};
      Object.keys(visibleColumns).forEach((column) => {
        if (visibleColumns[column].visible) {
          filteredRow[column] = getNestedValue(row, columns[column].path);
        }
      });
      return filteredRow;
    });
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "TableData.xlsx");
  };

  const handleColumnVisibilityChange = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: {
        ...visibleColumns[column],
        visible: !visibleColumns[column].visible,
      },
    });
  };

  const filteredData = data.filter((item) => {
    return Object.keys(visibleColumns).some(
      (column) =>
        visibleColumns[column].visible &&
        getNestedValue(item, columns[column].path)
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      const valueA = getNestedValue(a, columns[sortColumn].path);
      const valueB = getNestedValue(b, columns[sortColumn].path);
      if (sortDirection === "asc") {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    }
    return 0;
  });
 
  const paginatedData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleEditItem = (index) => {
    setFormData({ ...data[index] });
    setIsEditing(true);
    setEditIndex(index);
  };
  // const handleCheckboxChange = (index, checked) => {
  //   const updatedData = [...data];
  //   updatedData[index].checkbox = checked;
  //   setData(updatedData);
  
  //   const updatedSelectedRows = checked
  //     ? [...selectedRows, index]
  //     : selectedRows.filter((i) => i !== index);
  
  //   setSelectedRows(updatedSelectedRows);
  // };
  // const handleCheckboxClick = (index) => {
  //   const updatedData = [...data];
  //   updatedData[index].checkbox = !updatedData[index].checkbox;
  //   setData(updatedData);
  //   handleCheckboxChange(index, updatedData[index].checkbox);
  // };


  
  return (
    <div
    className={styles.tableGrid}
  >
    <div
          className={styles.colSpanTable}
        >
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <img src={SearchIcon} className={styles.searchIcon} alt="Search" />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.export}>
          <button
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img className={styles.menuIcon} src={DotsIcon} alt="Menu" />
          </button>
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={exportToPDF}>
                <FaFilePdf /> Export to PDF
              </button>
              <button className={styles.dropdownItem} onClick={exportToExcel}>
                <FaFileExcel /> Export to Excel
              </button>
            </div>
          )}
          <button
            className={styles.menuButton}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <img className={styles.filterIcon} src={FilterIcon} alt="Filter" />
          </button>
          {isFilterOpen && (
            <div className={styles.filterMenu}>
              {Object.keys(visibleColumns).map((column) => (
                <label key={column}>
                  <input
                    type="checkbox"
                    checked={visibleColumns[column].visible}
                    onChange={() => handleColumnVisibilityChange(column)}
                  />
                  {columns[column].label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className={styles.noDataContainer} style={{height:tableHeight}}>
          <h1>No Data Found</h1>
        </div>
      ) : (
        <div
        className={styles.tableOverflow}
        style={{height:tableHeight}}
      >
        <table ref={tableRef} className={styles.table}>
        <thead>
  <tr>

    {Object.keys(visibleColumns).map(
      (column) =>
        visibleColumns[column].visible && (
          <th
            key={column}
            data-resizable-column-id={column}
            onClick={() => handleSort(column)}
            style={{
              minWidth: visibleColumns[column].width,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span className={styles.spanClass}>
              {columns[column].label}
              {sortColumn === column && (
                <img
                  src={SortIcon}
                  className={styles.sortIcon}
                  alt="Sort Icon"
                />
              )}
            </span>
          </th>
        )
    )}
    {canEdit && <th className={canDelete ? styles.stickySecond : styles.sticky}>Edit</th>}
    {canDelete && <th className={styles.sticky}>Delete</th>}
  </tr>
</thead>

<tbody>
  {paginatedData.map((row, index) => {
    const rowIndex = currentPage * itemsPerPage + index;
    return (
      <tr key={index} className={deleting === index ? styles.rowDeleting : ""}>
        {Object.keys(visibleColumns).map((column) => {
          if (visibleColumns[column].visible) {
            const path = columns[column]?.path;
            const value = path ? getNestedValue(row, path) : '';
            return (
              <td
                title={value}
                key={column}
                style={{ minWidth: visibleColumns[column].width, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {columns[column].type === "checkbox" ? (
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updatedSelectedRows = checked ? data.map((_, idx) => idx) : [];
                      setSelectedRows(updatedSelectedRows);
                      const updatedData = data.map((row) => ({
                        ...row,
                        checkbox: checked,
                      }));
                      setData(updatedData);
                    }}
                  />
                ) : (
                  value
                )}
              </td>
            );
          }
          return null;
        })}
        {canEdit && (
          <td className={canDelete ? styles.stickySecond : styles.sticky} style={{ width: '50px' }}>
            <img
              src={Edit3dIcon}
              className={styles.sizeButton}
              onClick={() => handleEditItem(index)}
            />
          </td>
        )}
        {canDelete && (
          <td className={styles.sticky} style={{ width: '50px' }}>
            <img
              className={styles.deleteIcon}
              onClick={() => handleDeleteRow(index)}
              src={Delete3dIcon}
              alt="Delete"
            />
          </td>
        )}
      </tr>
    );
  })}
</tbody>


        </table>
        </div>
      )}
      {filteredData.length > 0 && (
        <div className={styles.paginationContainer}>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(filteredData.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(selectedItem) =>
              setCurrentPage(selectedItem.selected)
            }
            containerClassName={styles.pagination}
            activeClassName={styles.active}
          />
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

AutoTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      type: PropTypes.string,
      width: PropTypes.string,
      visible: PropTypes.bool,
    })
  ).isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  setData: PropTypes.func,
  setFormData: PropTypes.func,
  setIsEditing: PropTypes.func,
  setEditIndex: PropTypes.func,
  // handleCheckboxChange: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedRows: PropTypes.func.isRequired,
};
export default AutoTable;
