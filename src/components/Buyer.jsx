import React, { useEffect, useState } from "react";
import styles from "../styles/buyer.module.css";
import UpIcon from "../assets/up.svg";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { postApiService } from "../service/apiService";
import ViewBuyer from "./ViewBuyer";

const Buyer = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [buyerForm, setBuyerForm] = useState({
    buyerName: "",
    buyerAbbriviation: "",
    buyerBillingAddress: "",
    buyerShippingAddress: "",
    buyerPhone: "",
    buyerMobile: "",
    buyerEmail: "",
    buyerCity: "",
    buyerState: "",
    buyerCountry: "",
    buyerPincode: "",
    buyerType: "",
    buyerContactPerson: "",
    merchendiser: "",
    currency: "",
    bsAccountRequest: {
      bankName: "",
      bankBranch: "",
      bankAccountNo: "",
      bankIFSC: "",
      bankAccountType: "",
      bankCity: "",
      bankAddress: "",
      bankSwiftCode: "",
    },
    discount: "",
    paymentTerms: "",
    splDiscount: "",
    comments: "",
  });
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
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
  const handleConfirmAccountChange = (e) => {
    const value = e.target.value;
    setConfirmAccountNo(value);
  };

  const onSubmitBuyerForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = "buyer/create";
    try {
      const responseData = await postApiService(buyerForm, BASE_URL);
      togglePopup(responseData.message);
    } catch (error) {
      if (error.response) {
        togglePopup(
          error.response.data.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        togglePopup("No response received from the server.");
      } else {
        togglePopup(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleBuyerFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bank")) {
      setBuyerForm((prevState) => ({
        ...prevState,
        bsAccountRequest: {
          ...prevState.bsAccountRequest,
          [name]: value,
        },
      }));
    } else {
      setBuyerForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const today = new Date();

  useEffect(() => {
    if (confirmAccountNo === buyerForm.bsAccountRequest.bankAccountNo) {
      setIsMatching(true);
    } else {
      setIsMatching(false);
    }
  }, [buyerForm.bsAccountRequest.bankAccountNo, confirmAccountNo]);

  const formattedDate = today.toISOString().split("T")[0];

  return (
    <div className={styles.buyerMainContainer}>
      <div className={styles.headContiner}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>
            {activeButton === "view"
              ? "Buyer Directory Search"
              : "Buyer Directory"}
          </h1>
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
              onClick={() => {
                setActiveButton("view");
                {
                  !isCollapsed && toggleNavbar();
                }
              }}
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
                  value={buyerForm.buyerName}
                  name="buyerName"
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
                  value={buyerForm.buyerAbbriviation}
                  name="buyerAbbriviation"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="country">
                  Country
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.buyerCountry}
                    name="buyerCountry"
                    onChange={handleBuyerFormChange}
                  >
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
                  <select
                    className={styles.selectInput}
                    value={buyerForm.buyerCity}
                    name="buyerCity"
                    onChange={handleBuyerFormChange}
                  >
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
                  <select
                    className={styles.selectInput}
                    value={buyerForm.buyerType}
                    name="buyerType"
                    onChange={handleBuyerFormChange}
                  >
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
                  value={buyerForm.buyerPincode}
                  name="buyerPincode"
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
                  value={buyerForm.buyerBillingAddress}
                  name="buyerBillingAddress"
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
                  value={buyerForm.buyerContactPerson}
                  name="buyerContactPerson"
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
                  value={buyerForm.buyerMobile}
                  name="buyerMobile"
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
                  value={buyerForm.buyerShippingAddress}
                  name="buyerShippingAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="currency">
                  Currency
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.currency}
                    name="currency"
                    onChange={handleBuyerFormChange}
                  >
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
                  value={buyerForm.buyerPhone}
                  name="buyerPhone"
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
                  value={buyerForm.buyerEmail}
                  name="buyerEmail"
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
                  value={buyerForm.merchendiser}
                  name="merchendiser"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.bankName}
                  name="bankName"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.bankBranch}
                  name="bankBranch"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="city">
                  Bank City
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.bankCity}
                    name="bankCity"
                    onChange={handleBuyerFormChange}
                  >
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
                  value={buyerForm.bankSwiftCode}
                  name="bankSwiftCode"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.bankAddress}
                  name="bankAddress"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.bankAccountNo}
                  name="bankAccountNo"
                  onChange={handleBuyerFormChange}
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
                  value={confirmAccountNo}
                  onChange={handleConfirmAccountChange}
                  name="confirmAccountNo"
                  style={!isMatching ? { border: "2px solid red" } : {}}
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
                  value={buyerForm.bankIFSC}
                  name="bankIFSC"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.discount}
                  name="discount"
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.splDiscount}
                  name="splDiscount"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="type">
                  Payment Terms
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.paymentTerms}
                    name="paymentTerms"
                    onChange={handleBuyerFormChange}
                  >
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
                  value={buyerForm.comments}
                  name="comments"
                  onChange={handleBuyerFormChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.parentButtonContainer}>
            {loading ? (
              <div className={styles.buttonContainer}>
                <div className={styles.loader}></div>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                <button className={styles.resetButton}>Reset</button>
                <button
                  className={styles.submitButton}
                  disabled={!isMatching}
                  onClick={onSubmitBuyerForm}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          {isPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <h2>{popupMessage}</h2>
                <button className={styles.popupButton} onClick={togglePopup}>
                  OK
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <ViewBuyer />
      )}
    </div>
  );
};

export default Buyer;
