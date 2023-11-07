import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/viewBuyer.module.css";
import axios from "axios";
import { useSidebar } from "../context/SidebarContext";

import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
const ViewBuyer = () => {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState([]);
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const generateGridItem = (sample, index, fieldName, formatFunction) => (
    <div key={`${fieldName}-${index}`} className={styles.gridRow}>
      {formatFunction ? formatFunction(sample[fieldName]) : sample[fieldName]}
    </div>
  );

  const callApi = async (page = 1) => {
    setLoading(true);
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/sample/getAllBuyer/{page_num}?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedBuyer = response.data;

      setBuyers(fetchedBuyer);

    } catch (error) {
      console.error("Failed to fetch All buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGridRows = () => {
    return buyers.map((sample, index) => (
      <React.Fragment key={index}>
        {generateGridItem(sample, index, "bsId")}
        {generateGridItem(sample, index, "code")}
        {generateGridItem(sample, index, "bsName")}
        {generateGridItem(sample, index, "bsAbbreviation")}
        {generateGridItem(sample, index, "billingAddress")}
        {generateGridItem(sample, index, "deliveryAddress")}
        {generateGridItem(sample, index, "city")}
        {generateGridItem(sample, index, "pincode")}
        {generateGridItem(sample, index, "country")}
        {generateGridItem(sample, index, "currency")}
        {generateGridItem(sample, index, "bsCode")}
        {generateGridItem(sample, index, "contactPerson")}
        {generateGridItem(sample, index, "mobileExt")}
        {generateGridItem(sample, index, "mobile")}
        {generateGridItem(sample, index, "phone")}
        {generateGridItem(sample, index, "email")}
        {generateGridItem(sample, index, "username")}
        {generateGridItem(sample, index, "entDate", formatDDMMYYYYDate)}
      </React.Fragment>
    ));
  };

  useEffect(() => {
   
    callApi(1);
   
  }, []);

  const paginationRef = useRef(null);

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
    <div
      className={isCollapsed ? styles.topContainer : styles.topContainerOpen}
    >
      <div className={styles.viewBuyerDropGrid}>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="input4">
            User Name
          </label>
          <div className={styles.selectWrapper}>
            <select className={styles.selectInput} name="size">
              <option value="" selected disabled hidden>
                Select Name
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
            SR Type
          </label>
          <div className={styles.selectWrapper}>
            <select className={styles.selectInput} name="size">
              <option value="" selected disabled hidden>
                SR Type
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
            Date
          </label>
          <div className={styles.selectWrapper}>
            <select className={styles.selectInput} name="size">
              <option value="" selected disabled hidden>
                Select Date
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
            SR No.
          </label>
          <div className={styles.selectWrapper}>
            <select className={styles.selectInput} name="size">
              <option value="" selected disabled hidden>
                Select SR No.
              </option>
              <option value="11">11</option>
              <option value="22">22</option>
              <option value="32">32</option>
              <option value="33">33</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.viewSrDropGrid}>
          <div className={styles.colSpan4}>
            <div className={styles.loader}></div>
            <h2>Loading Buyers..</h2>
          </div>
        </div>
      ) : buyers.length === 0 ? (
        <div className={styles.viewSrDropGrid}>
          <div className={styles.colSpan4}>
            <h2>No Data Available</h2>
          </div>
        </div>
      ) : (
        <div className={styles.gridTableWrapper}>
          <div className={styles.gridTable}>
            {/* Header items */}
            <div className={styles.gridHeader}>Buyer Id</div>
            <div className={styles.gridHeader}>code</div>
            <div className={styles.gridHeader}>Buyer Name</div>
            <div className={styles.gridHeader}>Bs Abbreviation</div>
            <div className={styles.gridHeader}>Billing Address</div>
            <div className={styles.gridHeader}>Delivery Address</div>
            <div className={styles.gridHeader}>City</div>
            <div className={styles.gridHeader}>Pincode</div>
            <div className={styles.gridHeader}>Country</div>
            <div className={styles.gridHeader}>Currency</div>
            <div className={styles.gridHeader}>Buyer Code</div>
            <div className={styles.gridHeader}>Contact Person</div>
            <div className={styles.gridHeader}>Mobile extension </div>
            <div className={styles.gridHeader}>Mobile</div>
            <div className={styles.gridHeader}>Phone</div>
            <div className={styles.gridHeader}>Email</div>
            <div className={styles.gridHeader}>User Name</div>
            <div className={styles.gridHeader}>Date</div>

            {/* Data rows */}
            {renderGridRows()}
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>{renderPaginationControls()}</div>
    </div>
  );
};
export default ViewBuyer;
