import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/buyerPopup.module.css";
import TickCheck from "../assets/tickCheck.svg";
import axios from "axios";
import BlueCheck from "../assets/blueTick.svg";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";

import { getApiService } from "../service/apiService";
const BuyerPopup = ({ onCancel, onSubmitBuyerData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const callApi = async (page = 1) => {
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/sample/getAllBuyer/{page_num}?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedBuyers = response.data;

      const extractedData = fetchedBuyers.map((item) => ({
        bsName: item.bsName,
        billingAddress: item.billingAddress,
        bsId:item.bs_id
      }));
      setBuyers(extractedData);
      setSelectedRowIndex(null);
      setSelectedBuyer(null);
    } catch (error) {
      console.error("Failed to fetch All buyers:", error);
    }
  };

  const handleBuyerInputChange = async (e) => {
    const value = e.target.value;

    if (value.length === 0) {
     
       callApi(1);
    } else if(value.length >=3) {
      const BASE_URL = `sample/getBuyer?input=${encodeURIComponent(value)}`;
    
     try {
       const fetchedBuyers = await getApiService(BASE_URL);
       const extractedData = await fetchedBuyers.map((item) => ({
         bsName: item.bsName,
         billingAddress: item.deliveryAddress,
         bsId:item.bsId
       }));
     
       setBuyers(extractedData);
       setSelectedRowIndex(null);
       setSelectedBuyer(null);
     } catch (error) {
       console.error("Failed to fetch buyers:", error);
     }
    }
  };

  useEffect(() => {
    callApi(1);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const generateRow = (buyer, rowIndex) => (
    <tr
      key={rowIndex}
      onClick={() => {
        setSelectedRowIndex(rowIndex);
      
        setSelectedBuyer(buyer);
      }}
    >
      <td className={styles.selectColumn}>
        <button className={styles.selectButton}>
          <img
            src={selectedRowIndex === rowIndex ? BlueCheck : TickCheck}
            alt="Select Icon"
            className={styles.icon}
          />
        </button>
      </td>
      <td style={{ textAlign: "left" }} className={styles.buyerContent}>
        {buyer.bsName}
      </td>
      <td style={{ textAlign: "left" }} className={styles.buyerContent}>
        {buyer.billingAddress}
      </td>
      {/* Add more columns as needed */}
    </tr>
  );

  const renderTableRows = () => {
    return buyers.map(generateRow);
  };

  const paginationRef = useRef(null);

  // useEffect(() => {
  //   if (paginationRef.current) {
  //     const activePage = paginationRef.current.querySelector(
  //       `.${styles.activePage}`
  //     );
  //     if (activePage) {
  //       const containerLeft =
  //         paginationRef.current.getBoundingClientRect().left;
  //       const activeButtonLeft = activePage.getBoundingClientRect().left;
  //       const offset = activeButtonLeft - containerLeft;

  //       paginationRef.current.scrollLeft += offset;
  //     }
  //   }
  // }, [currentPage]);

  const renderPaginationControls = () => {
    const navigateTo = (page) => {
      if (page >= 1) {
        callApi(page);
        setCurrentPage(page);
      }
    };

    return (
      <div className={styles.parentPaginationControls}>
        <button
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <button className={styles.activePage}>{currentPage}</button>

        <button
          onClick={() => navigateTo(currentPage + 1)}
          disabled={buyers.length < 10}
        >
          &gt;
        </button>

        <input
          type="number"
          placeholder="Go to page"
          style={{ width: "80px" }}
          min="1"
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
                <label className={styles.sampleLabel} htmlFor="input1">
                  Buyer Name
                </label>

                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Type three letters"
                    className={styles.basicInput2}
                    onChange={handleBuyerInputChange}
                    name="buyername"
                  />
                  <button
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Buyer No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="size">
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
                  <select className={styles.selectInput} name="size">
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
                    <th className={styles.buyerColumn}>Buyer Name</th>
                    <th className={styles.buyerColumn}>Delivery Address</th>
                    {/* Add more headers as needed */}
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
          {renderPaginationControls()}
          <div className={styles.bottombuyerButtonContainer}>
            <h3>Couldn't find the Buyer ?</h3>
            <button
              className={styles.buyerPopupButton}
              onClick={() => navigate("/buyer")}
            >
              Add New Buyer
            </button>
            <button
              disabled={selectedBuyer == null}
              className={styles.buyerSelectPopupButton}
              onClick={() => {
                onSubmitBuyerData(selectedBuyer);
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default BuyerPopup;
