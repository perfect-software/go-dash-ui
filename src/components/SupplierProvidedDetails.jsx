import React, { useEffect, useState } from "react";
import styles from "../styles/supplierProvidedDetails.module.css";
import UpIcon from "../assets/up.svg";
import ArticlePopup from "../popups/ArticlePopup";
import { useNavigate } from "react-router-dom";
import BuyerPopup from "../popups/BuyerPopup";
import SampleDirPopup from "../popups/SampleDirPopup";

const SupplierProvidedDetails = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [isSampleDirPopup, setIsSampleDirPopup] = useState(false);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const [isGridVisible, setIsGridVisible] = useState({
    bank: true,
  });

  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };
  const today = new Date();

  const formattedDate = today.toISOString().split("T")[0];

  return (
    <>
      <div className={styles.topContainer}>
        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Person of Contact
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Name"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Designation
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Mobile Number
            </label>
            <input
              type="number"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              MSME
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              MSME No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="ownership">
              Ownership Type
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} name="ownership">
                <option value="" selected disabled hidden>
                  Select Owner
                </option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="bussinessNature">
              Bussiness <br/> Nature
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} name="bussinessNature">
                <option value="" selected disabled hidden>
                  Select Nature
                </option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="year">
              Estb. Year
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Year"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="buyer">
              Monthly Capacity
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Monthly Capacity"
            />
          </div>
          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="buyer">
              ISO
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="ISO"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="email">
              Lease time <br /> MOQ
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Lease time"
            />
          </div>
          <div className={styles.colSpan3}>
            <label className={styles.sampleLabel} htmlFor="phone">
              Major Products
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Major Products"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="paymentTerms">
              Payment terms
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Payment terms"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="gstNO">
              GST No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Gst Number"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="sa">
              Registered S.A.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Registered S.A."
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tds">
              TSD deduction
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="TSD deduction"
            />
          </div>
        </div>
      </div>

      <div className={styles.headSmallBorder}></div>

      <div className={styles.bottomContainer}>
        <div
          className={styles.insideBottomContainer}
          onClick={() => toggleGridVisibility("bank")}
        >
          <span>Bank Details</span>
          <img
            src={UpIcon}
            alt="Toggle Icon"
            className={`${styles.chervIcon} ${
              isGridVisible.bank ? "" : `${styles.chervRotate}`
            }`}
          />
        </div>
        <div
          id="detailsGrid"
          className={`${styles.bottomGrid} ${
            isGridVisible.bank ? "" : styles.hide
          }`}
        >
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Bank Name
            </label>
            <input
              type="text"
              placeholder="Bank Name"
              className={styles.basicInput}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Bank Branch
            </label>
            <input
              type="text"
              placeholder="Bank Branch"
              className={styles.basicInput}
            />
          </div>
          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Bank Address
            </label>
            <input
              type="text"
              placeholder="Bank Address"
              className={styles.basicInput}
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="city">
              City
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} name="city">
                <option value="" selected disabled hidden>
                  Select City
                </option>
                <option value="Lucknow">Lucknow</option>
                <option value="Delhi">Delhi</option>
                <option value="Agra">Agra</option>
                <option value="Kanpur">Kanpur</option>
              </select>
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="buyer">
              A/C no
            </label>
            <input
              type="number"
              className={styles.basicInput}
              placeholder="Account Number"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="buyer">
              IFSC Code
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="IFSC Code"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="buyer">
              Swift Code
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Swift"
            />
          </div>

          <div className={styles.largeColSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Comment
            </label>
            <textarea
              className={styles.largeInput}
              placeholder="Enter Here"
              rows="3" 
            ></textarea>
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.resetButton}>Reset</button>
        <button onClick={togglePopup} className={styles.submitButton}>
          Submit
        </button>
      </div>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>
              Supplier Details <br /> Successfully Submitted
            </h2>
            <button className={styles.popupButton} onClick={togglePopup}>
              OK
            </button>
          </div>
        </div>
      )}
      {isImagePopup && (
        <div className={styles.popupOverlay}>
          <div
            className={styles.imagePopupContent}
            style={{ backgroundImage: `url(${imagePreview})` }}
          >
            <button
              className={styles.popupButton}
              style={{ marginBottom: "3px" }}
              onClick={() => setIsImagePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isArticlePopup && (
        <ArticlePopup
          onCancel={() => {
            setIsArticlePopup(false);
          }}
        />
      )}
      {isBuyerPopup && (
        <BuyerPopup
          onCancel={() => {
            setIsBuyerPopup(false);
          }}
        />
      )}
      {isSampleDirPopup && (
        <SampleDirPopup
          onCancel={() => {
            setIsSampleDirPopup(false);
          }}
        />
      )}
    </>
  );
};

export default SupplierProvidedDetails;
