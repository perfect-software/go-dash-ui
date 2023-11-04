import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/sampleDirPopup.module.css";
import TickCheck from "../assets/tickCheck.svg";
import BlueCheck from "../assets/blueTick.svg";
import axios from "axios";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
import { formatDate , formatDDMMYYYYDate } from "../features/convertDate";

const SampleDirPopup = ({ onCancel, onSubmitSampleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const generateRow = (sample, rowIndex) => (
    <tr
      key={rowIndex}
      onClick={() => {
        setSelectedRowIndex(rowIndex);
        setSelectedSample(sample);
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
      <td className={styles.sampleContent}>{sample.sampleRef}</td>
      <td className={styles.sampleContent}>{formatDDMMYYYYDate(sample.buyer.entDate)}</td>
      <td className={styles.sampleContent}>{sample.season}</td>
      <td className={styles.sampleContent}>{sample.articleNo}</td>
      <td className={styles.sampleContent}>{sample.buyer.bsName}</td>
      <td className={styles.sampleContent}>{sample.sampleType}</td>
      <td className={styles.sampleContent}>{sample.buyerArticle}</td>
      <td className={styles.sampleContent}>{sample.buyer.deliveryAddress}</td>
      <td className={styles.sampleContent}>{sample.size}</td>
      <td className={styles.sampleContent}>{sample.quantity}</td>
      <td className={styles.sampleContent}>{sample.pair}</td>
      <td className={styles.sampleContent}>{sample.upperColor}</td>
      <td className={styles.sampleContent}>{sample.liningColor}</td>
      <td className={styles.sampleContent}>{sample.last}</td>
      <td className={styles.sampleContent}>{sample.insole}</td>
      <td className={styles.sampleContent}>{sample.soleLabel}</td>
      <td className={styles.sampleContent}>{sample.socks}</td>
      <td className={styles.sampleContent}>{sample.heel}</td>
      <td className={styles.sampleContent}>{sample.pattern}</td>
      <td className={styles.sampleContent}>{sample.buyerRef}</td>
      <td className={styles.sampleContent}>{sample.inUpperLeather}</td>
      <td className={styles.sampleContent}>{sample.inLining}</td>
      <td className={styles.sampleContent}>{sample.inSocks}</td>
      <td className={styles.sampleContent}>{sample.inQuantity}</td>
      <td className={styles.sampleContent}>{sample.comments}</td>
      <td className={styles.sampleContent}>{formatDDMMYYYYDate(sample.deliveryDate)}</td>
      <td className={styles.sampleContent}>{formatDDMMYYYYDate(sample.prodExDate)}</td>

      {/* Add more columns as needed */}
    </tr>
  );

  const callApi = async (page = 1) => {
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/sample/view/{page_num}?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedSample = response.data;
      setSamples(fetchedSample);
      setSelectedRowIndex(null);
      setSelectedSample(null);
    } catch (error) {
      console.error("Failed to fetch All buyers:", error);
    }
  };

  const renderTableRows = () => {
    return samples.map(generateRow);
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
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.sampleDirPopupContainer}>
          <div className={styles.topsampleDirPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Sample Directory</h1>
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
            <div className={styles.sampleDirDropGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Sample No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="size">
                    <option value="" selected disabled hidden>
                      Sample Name
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
                  Sample No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="size">
                    <option value="" selected disabled hidden>
                      Sample No.
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
                  Sample No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="size">
                    <option value="" selected disabled hidden>
                      Select Sample
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

          <div className={styles.bottomsampleDirPopupContainer}>
            <div className={styles.tablecontainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.selectColumn}>Select</th>
                    <th className={styles.SampleColumn}>SR No.</th>
                    <th className={styles.SampleColumn}>Date of order</th>
                    <th className={styles.SampleColumn}>Season</th>
                    <th className={styles.SampleColumn}>Article No</th>
                    <th className={styles.SampleColumn}>Buyer</th>
                    <th className={styles.SampleColumn}>Sample Type</th>
                    <th className={styles.SampleColumn}>Buyer Article</th>
                    <th className={styles.SampleColumn}>Delivery Address</th>
                    <th className={styles.SampleColumn}>Size</th>
                    <th className={styles.SampleColumn}>Quantity</th>
                    <th className={styles.SampleColumn}>Pair</th>
                    <th className={styles.SampleColumn}>Upper Color</th>
                    <th className={styles.SampleColumn}>Lining Color</th>
                    <th className={styles.SampleColumn}>Last</th>
                    <th className={styles.SampleColumn}>Insole</th>
                    <th className={styles.SampleColumn}>Sole Label</th>
                    <th className={styles.SampleColumn}>Socks</th>
                    <th className={styles.SampleColumn}>Heel</th>
                    <th className={styles.SampleColumn}>Pattern</th>
                    <th className={styles.SampleColumn}>Buyer Reference</th>
                    <th className={styles.SampleColumn}>In Upper Leather</th>
                    <th className={styles.SampleColumn}>In Lining</th>
                    <th className={styles.SampleColumn}>In Socks</th>
                    <th className={styles.SampleColumn}>In Quantity</th>
                    <th className={styles.SampleColumn}>Comments</th>
                    <th className={styles.SampleColumn}>Delivery Date</th>
                    <th className={styles.SampleColumn}>Production Ex Date</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
          {renderPaginationControls()}
          <div className={styles.bottomSampleButtonContainer}>
            <button
              disabled={selectedSample == null}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitSampleData(selectedSample);
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

export default SampleDirPopup;
