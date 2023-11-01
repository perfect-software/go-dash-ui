import React, { useEffect, useState } from "react";
import styles from "../styles/buyer.module.css";
import UpIcon from "../assets/up.svg";
import ArticlePopup from "../popups/ArticlePopup";
import { useNavigate } from "react-router-dom";
import BuyerPopup from "../popups/BuyerPopup";
import SampleDirPopup from "../popups/SampleDirPopup";

const Buyer = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [isSampleDirPopup, setIsSampleDirPopup] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    bsName: "",
    bsAbbreviation: "",
    billingAddress: "",
    deliveryAddress: "",
    city: "",
    pincode: "",
    country: "",
    currency: "",
    bsCode: "",
    contactPerson: "",
    mobileExt: "",
    mobile: "",
    phone: "",
    email: "",
    username: "",
  });
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const [isGridVisible, setIsGridVisible] = useState({
    bank: true,
    financials: true,
  });

  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };

  const handleBuyerFormChange = (e) => {
    const { name, value } = e.target;
    setBuyerForm({ ...buyerForm, [name]: value });
  };
  const today = new Date();

  const formattedDate = today.toISOString().split("T")[0];

  return (
    <div className={styles.buyerMainContainer}>
      <div className={styles.headContiner}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Buyer Directory</h1>
        </div>

        <div className={styles.subHeadContainerTwo}>
          {/* <h2>Sample Order Details</h2> */}
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Buyer Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("view")}
            >
              View all buyers
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={buyerForm.bsName}
                  name="bsName"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Abbreviation
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter here "
                  value={buyerForm.bsAbbreviation}
                  name="bsAbbreviation"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="country">
                  Country
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput}  
                  value={buyerForm.country}
                  name="country"
                  onChange={handleBuyerFormChange}>
                    <option value="" selected disabled hidden>
                      Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="Italy">Italy</option>
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="city">
                  City
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput}
                   value={buyerForm.city}
                   name="city"
                   onChange={handleBuyerFormChange}>
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
                <label className={styles.sampleLabel} htmlFor="city">
                  Buyer Type
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="city">
                    <option value="" selected disabled hidden>
                      Select Type
                    </option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="Type 3">Type 3</option>
                    <option value="Type 4">Type 4</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Pincode
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Pincode"
                  value={buyerForm.pincode}
                  name="pincode"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Billing Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  value={buyerForm.billingAddress}
                  name="billingAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Contact Person
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  value={buyerForm.contactPerson}
                  name="contactPerson"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Mobile Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Mobile Number"
                  value={buyerForm.mobile}
                  name="mobile"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Delivery Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  value={buyerForm.deliveryAddress}
                  name="deliveryAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="currency">
                  Currency
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput}
                   value={buyerForm.currency}
                   name="currency"
                   onChange={handleBuyerFormChange}>
                    <option value="" selected disabled hidden>
                      Select Currency
                    </option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EURO">EURO</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Phone Number"
                  value={buyerForm.phone}
                  name="phone"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="email">
                  Email Id
                </label>
                <input
                  type="email"
                  className={styles.basicInput}
                  placeholder="Email"
                  value={buyerForm.email}
                  name="email"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="merchandiser">
                  Merchandiser
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Merchandiser"
                />
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerTop}
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
              className={`${styles.middleGrid} ${
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
                  Swift Code
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Swift"
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

              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  A/C no
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Account Number"
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Confirm <br />
                  A/C no
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Confirm Account Number"
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="IFSC Code"
                />
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.bottomContainer}>
            <div
              className={styles.insideBottomContainer}
              onClick={() => toggleGridVisibility("financials")}
            >
              <span>Financials</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.financials ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.bottomGrid} ${
                isGridVisible.financials ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Discount %
                </label>
                <input
                  type="text"
                  placeholder="Discount"
                  className={styles.basicInput}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  SP. Discount
                </label>
                <input
                  type="text"
                  placeholder=" SP. Discount"
                  className={styles.basicInput}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="type">
                  Payment Terms
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="type">
                    <option value="" selected disabled hidden>
                      Select Type
                    </option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="Type 3">Type 3</option>
                    <option value="Type 4">Type 4</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan3}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Comment
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
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
                  Buyer Details <br /> Successfully Submitted
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
      ) : (
        <div>View Sr</div>
      )}
    </div>
  );
};

export default Buyer;
