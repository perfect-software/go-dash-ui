import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/viewSr.module.css";
import axios from "axios";
import { useSidebar } from "../context/SidebarContext";

import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";

const ViewSr = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [samples, setSamples] = useState([]);
  const { isCollapsed } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);

  const generateGridItem = (sample, index, fieldName, formatFunction) => (
    <div key={`${fieldName}-${index}`} className={styles.gridRow}>
      {formatFunction ? formatFunction(sample[fieldName]) : sample[fieldName]}
    </div>
  );

  const callApi = async (page = 1) => {
    setLoading(true);
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/sample/view/{page_num}?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedSample = response.data;
      setSamples(fetchedSample);
    } catch (error) {
      console.error("Failed to fetch All Sample:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGridRows = () => {
    return samples.map((sample, index) => (
      <React.Fragment key={index}>
        {generateGridItem(sample, index, "sampleRef")}
        {generateGridItem(sample.buyer, index, "entDate", formatDDMMYYYYDate)}
        {generateGridItem(sample, index, "season")}
        {generateGridItem(sample, index, "articleNo")}
        {generateGridItem(sample.buyer, index, "bsName")}
        {generateGridItem(sample, index, "sampleType")}
        {generateGridItem(sample, index, "buyerArticle")}
        {generateGridItem(sample.buyer, index, "deliveryAddress")}
        {generateGridItem(sample, index, "size")}
        {generateGridItem(sample, index, "quantity")}
        {generateGridItem(sample, index, "pair")}
        {generateGridItem(sample, index, "upperColor")}
        {generateGridItem(sample, index, "liningColor")}
        {generateGridItem(sample, index, "last")}
        {generateGridItem(sample, index, "insole")}
        {generateGridItem(sample, index, "soleLabel")}
        {generateGridItem(sample, index, "socks")}
        {generateGridItem(sample, index, "heel")}
        {generateGridItem(sample, index, "pattern")}
        {generateGridItem(sample, index, "buyerRef")}
        {generateGridItem(sample, index, "inUpperLeather")}
        {generateGridItem(sample, index, "inLining")}
        {generateGridItem(sample, index, "inSocks")}
        {generateGridItem(sample, index, "inQuantity")}
        {generateGridItem(sample, index, "comments")}
        {generateGridItem(sample, index, "deliveryDate", formatDDMMYYYYDate)}
        {generateGridItem(sample, index, "prodExDate", formatDDMMYYYYDate)}
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
          disabled={samples.length < 10}
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
      <div className={styles.viewSrDropGrid}>
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
               <h2>Loading Requests..</h2>
            </div>
        </div>
      ) : samples.length === 0 ? (
        <div className={styles.viewSrDropGrid}>
          <div className={styles.colSpan4}>
            <h2>No Data Available</h2>
          </div>
        </div>
      ) : (
        <>
         <div className={styles.gridTableWrapper}>
          <div className={styles.gridTable}>
            <div className={styles.gridHeader}>SR No.</div>
            <div className={styles.gridHeader}>Date of Order</div>
            <div className={styles.gridHeader}>Season</div>
            <div className={styles.gridHeader}>Article No</div>
            <div className={styles.gridHeader}>Buyer</div>
            <div className={styles.gridHeader}>Sample Type</div>
            <div className={styles.gridHeader}>Buyer Article</div>
            <div className={styles.gridHeader}>Delivery Address</div>
            <div className={styles.gridHeader}>Size</div>
            <div className={styles.gridHeader}>Quantity</div>
            <div className={styles.gridHeader}>Pair</div>
            <div className={styles.gridHeader}>Upper Color</div>
            <div className={styles.gridHeader}>Lining Color</div>
            <div className={styles.gridHeader}>Last</div>
            <div className={styles.gridHeader}>Insole</div>
            <div className={styles.gridHeader}>Sole Label</div>
            <div className={styles.gridHeader}>Socks</div>
            <div className={styles.gridHeader}>Heel</div>
            <div className={styles.gridHeader}>Pattern</div>
            <div className={styles.gridHeader}>Buyer Reference</div>
            <div className={styles.gridHeader}>In Upper Leather</div>
            <div className={styles.gridHeader}>In Lining</div>
            <div className={styles.gridHeader}>In Socks</div>
            <div className={styles.gridHeader}>In Quantity</div>
            <div className={styles.gridHeader}>Comments</div>
            <div className={styles.gridHeader}>Delivery Date</div>
            <div className={styles.gridHeader}>Production Ex Date</div>

            {renderGridRows()}
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>{renderPaginationControls()}</div>
        </>
       
      )}
   
    </div>
  );
};

export default ViewSr;
