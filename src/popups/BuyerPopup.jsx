import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/buyerPopup.module.css";
import TickCheck from "../assets/tickCheck.svg";
import BlueCheck from "../assets/blueTick.svg";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
const BuyerPopup = ({onCancel}) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const ROWS_PER_PAGE = 4;

  const rowData = [
    {
      id: 1,
      columns: [
        "Content1-1",
        "Content1-2",
        "Content1-3",
        "Content1-4",
        "Content1-5",
        "Content1-6",
        "Content1-7",
        "Content1-8",
        "Content1-9",
        "Content1-10",
        "Content1-11",
        "Content1-12",
      ],
    },
    {
      id: 2,
      columns: [
        "Content2-1",
        "Content2-2",
        "Content2-3",
        "Content2-4",
        "Content2-5",
        "Content2-6",
        "Content2-7",
        "Content2-8",
        "Content2-9",
        "Content2-10",
        "Content2-11",
        "Content2-12",
      ],
    },
    {
      id: 3,
      columns: [
        "Content3-1",
        "Content3-2",
        "Content3-3",
        "Content3-4",
        "Content3-5",
        "Content3-6",
        "Content3-7",
        "Content3-8",
        "Content3-9",
        "Content3-10",
        "Content3-11",
        "Content3-12",
      ],
    },
    {
      id: 4,
      columns: [
        "Content4-1",
        "Content4-2",
        "Content4-3",
        "Content4-4",
        "Content4-5",
        "Content4-6",
        "Content4-7",
        "Content4-8",
        "Content4-9",
        "Content4-10",
        "Content4-11",
        "Content4-12",
      ],
    },
    {
      id: 5,
      columns: [
        "Content5-1",
        "Content5-2",
        "Content5-3",
        "Content5-4",
        "Content5-5",
        "Content5-6",
        "Content5-7",
        "Content5-8",
        "Content5-9",
        "Content5-10",
        "Content5-11",
        "Content5-12",
      ],
    },
    {
      id: 6,
      columns: [
        "Content6-1",
        "Content6-2",
        "Content6-3",
        "Content6-4",
        "Content6-5",
        "Content6-6",
        "Content6-7",
        "Content6-8",
        "Content6-9",
        "Content6-10",
        "Content6-11",
        "Content6-12",
      ],
    },
    {
      id: 7,
      columns: [
        "Content7-1",
        "Content7-2",
        "Content7-3",
        "Content7-4",
        "Content7-5",
        "Content7-6",
        "Content7-7",
        "Content7-8",
        "Content7-9",
        "Content7-10",
        "Content7-11",
        "Content7-12",
      ],
    },
  ];
  

  

  const totalRows = 100;
  const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  const generateRow = (data, rowIndex) => (
    <tr
      key={data.id}>
      <td className={styles.selectColumn}>
        <button
          className={styles.selectButton}
          onClick={(e) => {
            e.stopPropagation(); 
            if (selectedRowIndex === rowIndex) {
             
              setSelectedRowIndex(null);
            } else {
              setSelectedRowIndex(rowIndex);
             
            }
          }}
        >
        <img src={selectedRowIndex === rowIndex ? BlueCheck : TickCheck} alt="Select Icon" className={styles.icon} />

        </button>
      </td>
      {data.columns.map((columnData, columnIndex) => (
        <td className={styles.buyerContent} key={columnIndex}>
          {columnData}
        </td>
      ))}
    </tr>
  );
  const renderTableRows = () => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return rowData.slice(start, end).map(generateRow);
  };
  const paginationRef = useRef(null);

  useEffect(() => {
    if (paginationRef.current) {
      const activePage = paginationRef.current.querySelector(
        `.${styles.activePage}`
      );
      if (activePage) {
        const containerLeft =
          paginationRef.current.getBoundingClientRect().left;
        const activeButtonLeft = activePage.getBoundingClientRect().left;
        const offset = activeButtonLeft - containerLeft;

        paginationRef.current.scrollLeft += offset;
      }
    }
  }, [currentPage]);

  const renderPaginationControls = () => {
    const pageNumbers = [];

    const navigateTo = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => navigateTo(i)}
          className={i === currentPage ? styles.activePage : ""}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.parentPaginationControls}>
        <button
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <div
          className={styles.paginationControls}
          style={{ width: totalRows > 30 ? "8rem" : "fit-content" }}
          ref={paginationRef}
        >
          {pageNumbers}
        </div>
        <button
          onClick={() => navigateTo(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
        <input
          type="number"
          placeholder="Go to page"
          min="1"
          max={totalPages}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              navigateTo(Number(e.target.value));
            }
          }}
        />
      </div>
    );
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.buyerPopupContainer}>
          <div className={styles.topbuyerPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Buyer Directory</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
            <div className={styles.buyerDropGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Buyer No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="size">
                    <option value="" selected disabled hidden>
                      Buyer Name
                    </option>
                    <option value="11">11</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Buyer No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="size">
                    <option value="" selected disabled hidden>
                     Buyer No.
                    </option>
                    <option value="11">11</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Buyer No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="size">
                    <option value="" selected disabled hidden>
                      Select Buyer
                    </option>
                    <option value="11">11</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bottombuyerPopupContainer}>
            <div className={styles.tablecontainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.selectColumn}>Select</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>Buyer</th>
                    <th className={styles.buyerColumn}>buyer</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
          {totalRows > 5 && renderPaginationControls()}
          <div className={styles.bottombuyerButtonContainer}>
            <h3>Couldn't find the Buyer ?</h3>
            <button
              className={styles.buyerPopupButton}
              onClick={() => navigate("/buyerdirectory")}
            >
              Add New Buyer
            </button>
          </div>
        </div>
      </div>
    )
    );
  };
export default BuyerPopup