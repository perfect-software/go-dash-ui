import React, { useEffect, useState,useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import { Country, State, City } from "country-state-city";
import Currencydata from "currency-codes/data";
import EyeClosedIcon from "../assets/closeEye.svg";
import EyeOpenIcon from "../assets/openEye.svg";
import UpIcon from "../assets/up.svg";
import IButtonIcon from "../assets/iButton.svg";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { useDispatch } from "react-redux";
import { postApiService } from "../service/apiService";
import ViewBuyer from "./ViewBuyer";
import Downshift from "downshift";
import { generatePDF } from "../features/generateBuyerPDF";
import InfoPopup from "../popups/InfoPopup";

const Buyer = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showAccount, setShowAccount] = useState({
    account: false,
    confirmAccount: false,
  });
  const [isInfoPopup, setIsInfoPopup] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [allCountries, setAllCountires] = useState([]);
  const dispatch = useDispatch();
  const commentTextareaRef = useRef(null);
  const [allStates, setAllStates] = useState([]);
  const initialValidationState = {};
  const [validation, setValidation] = useState(initialValidationState);
  const [allCities, setAllCities] = useState([]);
  const [printBuyer, setPrintBuyer] = useState(null);
  const [isPrintSelected, setIsPrintSelected] = useState(false);
  const [tempList, setTempList] = useState({
    countryList: [],
    stateList: [],
    cityList: [],
    currencyList: [],
  });
  const [currencyList, setCurrencyList] = useState([]);
  const [isMatching, setIsMatching] = useState(true);
  const [location, setLocation] = useState({
    country: "",
    state: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    buyerCountry: false,
    buyerState: false,
    buyerCity: false,
    currency: false,
  });
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [buyerForm, setBuyerForm] = useState(() => {
    const savedForm = localStorage.getItem("buyerForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
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
        };
  });
  useEffect(() => {
    localStorage.setItem("buyerForm", JSON.stringify(buyerForm));
  }, [buyerForm]);

  const handleBuyerPrint = (buyer) => {
    setPrintBuyer(buyer);
    setIsPrintSelected(buyer !== null);
  };
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};
    const directFields = [
        "buyerName",
        "buyerBillingAddress",
        "buyerShippingAddress",
        "buyerPhone",
        "buyerMobile",
        "buyerEmail",
        "buyerCity",
        "buyerState",
        "buyerCountry",
        "buyerPincode",
        "buyerType",
        "buyerContactPerson",
        "merchendiser",
        "currency",
        "paymentTerms",
    ];

    const bsAccountRequestFields = [
        "bankName",
        "bankBranch",
        "bankAccountNo",
        "bankIFSC",
        "bankCity",
        "bankAddress",
    ];
    directFields.forEach(field => {
        if (!buyerForm[field] || buyerForm[field].trim() === "") {
            isValid = false;
            newValidation[field] = "invalid";
        } else {
            newValidation[field] = "valid";
        }
    });
    bsAccountRequestFields.forEach(field => {
        if (!buyerForm.bsAccountRequest[field] || buyerForm.bsAccountRequest[field].trim() === "") {
            isValid = false;
            newValidation[`bsAccountRequest.${field}`] = "invalid";
        } else {
            newValidation[`bsAccountRequest.${field}`] = "valid";
        }
    });

    setValidation(newValidation);
    return isValid;
};

  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  const validatePhoneNumber = (number) => {
    if (number) {
      return /^\d{10}$/.test(number);
    }
    return true;
  };
  const validateEmail = (email) => {
    if (email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    }
    return true;
};

useEffect(() => {
  const textareas = [
    commentTextareaRef.current,
  ];

  const autosizeListener = (event) => autosize(event.target);

  textareas.forEach((textarea) => {
    if (textarea) {
      textarea.addEventListener("keydown", autosizeListener);
    }
  });

  return () => {
    textareas.forEach((textarea) => {
      if (textarea) {
        textarea.removeEventListener("keydown", autosizeListener);
      }
    });
  };
}, []);
  const [isGridVisible, setIsGridVisible] = useState({
    bank: true,
    financials: true,
  });
  const resetAllFields = () => {
    setBuyerForm({
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
    setValidation(initialValidationState);
    setConfirmAccountNo("");
    localStorage.setItem(
      "buyerForm",
      JSON.stringify(buyerForm)
    );
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setBuyerForm({ ...buyerForm, [name]: value });

    if (value.length < 1) {
      toggleSuggestVisibility(`${name}`, false);
    }
    if (name === "buyerCountry" && value.length >= 2) {
      if (allCountries.length === 0) {
        setAllCountires(Country.getAllCountries());
      }
      const filteredCountries = allCountries
        .filter((country) =>
          country.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((country) => ({
          name: country.name,
          isoCode: country.isoCode,
        }));

      setTempList({ ...tempList, countryList: filteredCountries });

      toggleSuggestVisibility("buyerCountry", true);
    } else if (name === "buyerState" && value.length >= 2) {
      if (allStates.length === 0) {
        setAllStates(State.getStatesOfCountry(location.country));
      }
      const filteredStates = allStates
        .filter((state) =>
          state.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((state) => ({
          name: state.name,
          isoCode: state.isoCode,
        }));
      setTempList({ ...tempList, stateList: filteredStates });

      toggleSuggestVisibility("buyerState", true);
    } else if (name === "buyerCity" && value.length >= 2) {
      if (allCities.length === 0) {
        setAllCities(City.getCitiesOfState(location.country, location.state));
      }
      const filteredCity = allCities
        .filter((city) => city.name.toLowerCase().includes(value.toLowerCase()))
        .map((city) => ({
          name: city.name,
        }));
      setTempList({ ...tempList, cityList: filteredCity });

      toggleSuggestVisibility("buyerCity", true);
    } else if (name === "currency" && value.length >= 2) {
      const filteredCurrency = currencyList
        .filter((currency) =>
          currency.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((currency) => ({
          name: currency.name,
          code: currency.code,
        }));
      setTempList({ ...tempList, currencyList: filteredCurrency });
      toggleSuggestVisibility("currency", true);
    }
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handlePrintClick = async ()=>{
  
     await generatePDF(printBuyer);
  }

  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };

  const toggleAccountVisibility = (visible) => {
    setShowAccount((prevState) => ({
      ...prevState,
      [visible]: !prevState[visible],
    }));
  };
  const handleConfirmAccountChange = (e) => {
    const value = e.target.value;
    setConfirmAccountNo(value);
  };
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const onSubmitBuyerForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const BASE_URL = "buyer/create";
    try {
      const responseData = await postApiService(buyerForm, BASE_URL);
      if (responseData.responseStatus && responseData.responseStatus.description) {
        togglePopup(
          responseData.responseStatus.description);
      }
      dispatch(fetchAllBuyers());
      resetAllFields();
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.data.responseStatus) {
        errorMessage =
          error.response.data.responseStatus.description ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }
      togglePopup(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const downshiftCountry = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setBuyerForm({
            ...buyerForm,
            buyerCountry: selectedItem.name,
          });
          toggleSuggestVisibility("buyerCountry", false);
          setLocation({
            ...location,
            country: selectedItem.isoCode,
          });
        }
      }}
      selectedItem={buyerForm.buyerCountry}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "buyerCountry",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            style={
              validation.buyerCountry === "invalid" ? { border: "2px solid red" } : {}
            }
            value={buyerForm.buyerCountry}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyerCountry &&
              tempList.countryList.map((country, index) => (
                <div
                  {...getItemProps({ key: index, index, item: country })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {country.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftState = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setBuyerForm({
            ...buyerForm,
            buyerState: selectedItem.name,
          });
          toggleSuggestVisibility("buyerState", false);
          setLocation({ ...location, state: selectedItem.isoCode });
        }
      }}
      selectedItem={buyerForm.buyerState}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "buyerState",
            })}
            type="text"
            disabled={!buyerForm.buyerCountry}
            className={styles.basicInput}
            style={
              validation.buyerState === "invalid" ? { border: "2px solid red" } : {}
            }
            placeholder="Insert Two Letter"
            value={buyerForm.buyerState}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyerState &&
              tempList.stateList.map((state, index) => (
                <div
                  {...getItemProps({ key: index, index, item: state })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {state.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftCity = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setBuyerForm({
            ...buyerForm,
            buyerCity: selectedItem.name,
          });
          toggleSuggestVisibility("buyerCity", false);
        }
      }}
      selectedItem={buyerForm.buyerCity}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "buyerCity",
            })}
            type="text"
            disabled={!buyerForm.buyerCountry || !buyerForm.buyerState}
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            style={
              validation.buyerCity === "invalid" ? { border: "2px solid red" } : {}
            }
            value={buyerForm.buyerCity}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyerCity &&
              tempList.cityList.map((city, index) => (
                <div
                  {...getItemProps({ key: index, index, item: city })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {city.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftCurrency = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setBuyerForm({
            ...buyerForm,
            currency: selectedItem.code,
          });
          toggleSuggestVisibility("currency", false);
        }
      }}
      selectedItem={buyerForm.currency}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "currency",
            })}
            type="text"
            className={styles.basicInput}
            style={
              validation.currency === "invalid" ? { border: "2px solid red" } : {}
            }
            placeholder="Insert Two Letter"
            value={buyerForm.currency}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.currency &&
              tempList.currencyList.map((curr, index) => (
                <div
                  {...getItemProps({ key: index, index, item: curr })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {curr.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const getCurrency = () => {
    const value = Currencydata;

    if (value) {
      const filteredCurrency = Currencydata.filter((currencyInfo) =>
        currencyInfo.currency.toLowerCase()
      ).map((currencyInfo) => ({
        name: currencyInfo.currency,
        code: currencyInfo.code,
      }));
      setCurrencyList(filteredCurrency);
    }
  };
  useEffect(() => {
    getCurrency();
  }, []);
  useEffect(() => {
    const toggleActiveButton = (event) => {
      if (event.code === "ControlRight") {
        setActiveButton((prevButton) =>
          prevButton === "details" ? "view" : "details"
        );
        if (activeButton === "view" && !isCollapsed) {
          toggleNavbar();
        } 
      }
    };
    window.addEventListener("keydown", toggleActiveButton);
    return () => {
      window.removeEventListener("keydown", toggleActiveButton);
    };
  }, [activeButton, isCollapsed, toggleNavbar]);
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "P" || event.key === "p"  && activeButton === "view" && isPrintSelected) {
       handlePrintClick(); 
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeButton, isPrintSelected,handlePrintClick]);
  useEffect(() => {
    if (confirmAccountNo === buyerForm.bsAccountRequest.bankAccountNo) {
      setIsMatching(true);
    } else {
      setIsMatching(false);
    }
  }, [buyerForm.bsAccountRequest.bankAccountNo, confirmAccountNo]);

  return (
    <div className={styles.buyerMainContainer}>
      <div className={styles.headContiner}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>
            {activeButton === "view"
              ? "Buyer Directory Search"
              : "Buyer Directory"}
          </h1>
          {activeButton === "details" && (
                 <div>
                 <img
                   src={IButtonIcon}
                   onClick={() => {
                     setIsInfoPopup(true);
                   }}
                   className={styles.ibutton}
                   alt="iButton"
                 />
               </div>
              )} 
        </div>

        <div className={styles.subHeadContainerTwo}>
          {/* <h2>Sample Order Details</h2> */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          
        </div>
        <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="input1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={buyerForm.buyerName}
                  name="buyerName"
                  onChange={handleBuyerFormChange}
                  style={
                    validation.buyerName === "invalid" ? { border: "2px solid red" } : {}
                  }
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
                <label className={styles.impsampleLabel} htmlFor="email">
                  Email Id
                </label>
                <input
                  type="email"
                  className={styles.basicInput}
                  placeholder="Email"
                  value={buyerForm.buyerEmail}
                  name="buyerEmail"
                  style={
                    !validateEmail(buyerForm.buyerEmail) || validation.buyerEmail === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="merchandiser">
                  Merchandiser
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Merchandiser"
                  value={buyerForm.merchendiser}
                  name="merchendiser"
                  style={
                    validation.merchendiser === "invalid" ? { border: "2px solid red" } : {}
                  }
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="country">
                  Country
                </label>
                {downshiftCountry}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                  State
                </label>
                {downshiftState}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                  City
                </label>
                {downshiftCity}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                  Buyer Type
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.buyerType}
                    name="buyerType"
                    style={
                      validation.buyerType === "invalid" ? { border: "2px solid red" } : {}
                    }
                    onChange={handleBuyerFormChange}
                  >
                    <option value="" selected disabled hidden>
                      Select Type
                    </option>
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Pincode
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Pincode"
                  style={
                    validation.buyerPincode === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.buyerPincode}
                  name="buyerPincode"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Billing Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  style={
                    validation.buyerBillingAddress === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.buyerBillingAddress}
                  name="buyerBillingAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Contact Person
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  style={
                    validation.buyerContactPerson === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.buyerContactPerson}
                  name="buyerContactPerson"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Mobile Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Mobile Number"
                  value={buyerForm.buyerMobile}
                  name="buyerMobile"
                  onChange={handleBuyerFormChange}
                  style={
                    !validatePhoneNumber(buyerForm.buyerMobile) || validation.buyerMobile === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Delivery Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  style={
                    validation.buyerShippingAddress === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.buyerShippingAddress}
                  name="buyerShippingAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Phone Number"
                  value={buyerForm.buyerPhone}
                  name="buyerPhone"
                  onChange={handleBuyerFormChange}
                  style={
                      validation.buyerPhone === "invalid" || !validatePhoneNumber(buyerForm.buyerPhone)
                      ? { border: "2px solid red" }
                      : {}
                  }
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="currency">
                  Currency
                </label>
                {downshiftCurrency}
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
                <label className={styles.impsampleLabel} htmlFor="input1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="Bank Name"
                  className={styles.basicInput}
                  value={buyerForm.bsAccountRequest.bankName}
                  name="bankName"
                  style={
                    validation["bsAccountRequest.bankName"] === "invalid" ? { border: "2px solid red" } : {}
                  }
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="input1">
                  Bank Branch
                </label>
                <input
                  type="text"
                  placeholder="Bank Branch"
                  className={styles.basicInput}
                  value={buyerForm.bsAccountRequest.bankBranch}
                  name="bankBranch"
                  style={
                    validation["bsAccountRequest.bankBranch"] === "invalid" ? { border: "2px solid red" } : {}
                  }
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                  Bank City
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Bank City"
                  value={buyerForm.bsAccountRequest.bankCity}
                  name="bankCity"
                  style={
                    validation["bsAccountRequest.bankCity"] === "invalid" ? { border: "2px solid red" } : {}
                  }
                  onChange={handleBuyerFormChange}
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
                  value={buyerForm.bsAccountRequest.bankSwiftCode}
                  name="bankSwiftCode"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="input1">
                  Bank Address
                </label>
                <input
                  type="text"
                  placeholder="Bank Address"
                  className={styles.basicInput}
                  style={
                    validation["bsAccountRequest.bankAddress"] === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.bsAccountRequest.bankAddress}
                  name="bankAddress"
                  onChange={handleBuyerFormChange}
                />
              </div>

              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  A/C no
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type={showAccount.account ? "text" : "password"}
                    className={styles.basicInput2}
                    placeholder="Account Number"
                    value={buyerForm.bsAccountRequest.bankAccountNo}
                    name="bankAccountNo"
                    style={
                      validation["bsAccountRequest.bankAccountNo"] === "invalid" ? { border: "2px solid red" } : {}
                    }
                    onChange={handleBuyerFormChange}
                  />
                  <button
                    className={styles.eyeButton}
                    onClick={() => toggleAccountVisibility("account")}
                  >
                    <img
                      className={styles.eyeIcon}
                      src={showAccount.account ? EyeOpenIcon : EyeClosedIcon}
                      alt="eye icon"
                    />
                  </button>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Confirm <br />
                  A/C no
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type={showAccount.confirmAccount ? "text" : "password"}
                    className={styles.basicInput2}
                    placeholder="Confirm Account Number"
                    value={confirmAccountNo}
                    onChange={handleConfirmAccountChange}
                    name="confirmAccountNo"
                    style={!isMatching ? { border: "2px solid red" } : {}}
                  />
                  <button
                    className={styles.eyeButton}
                    onClick={() => toggleAccountVisibility("confirmAccount")}
                  >
                    <img
                      className={styles.eyeIcon}
                      src={
                        showAccount.confirmAccount ? EyeOpenIcon : EyeClosedIcon
                      }
                      alt="eye icon"
                    />
                  </button>
                </div>
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="IFSC Code"
                  style={
                    validation["bsAccountRequest.bankIFSC"] === "invalid" ? { border: "2px solid red" } : {}
                  }
                  value={buyerForm.bsAccountRequest.bankIFSC}
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
                  type="number"
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
                  type="number"
                  placeholder=" SP. Discount"
                  className={styles.basicInput}
                  value={buyerForm.splDiscount}
                  name="splDiscount"
                  onChange={handleBuyerFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="type">
                  Payment Terms
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={buyerForm.paymentTerms}
                    name="paymentTerms"
                    style={
                      validation.paymentTerms === "invalid" ? { border: "2px solid red" } : {}
                    }
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
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="commentLeather">
                  Comment
                </label>
                <textarea
                  ref={commentTextareaRef}
                  className={styles.commentInput}
                  placeholder="Enter Here"
                  maxLength="200"
                  name="comments"
                  value={buyerForm.comments}
                  onChange={handleBuyerFormChange}
                  rows="3"
                ></textarea>
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
                <button className={styles.resetButton} onClick={resetAllFields}>
                  Reset
                </button>
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
          {isInfoPopup && (
            <InfoPopup
              onCancel={() => {
                setIsInfoPopup(false);
              }}
              infoName={"Buyer"}
            />
          )}
        </>
      ) : (
        <ViewBuyer onBuyerSelect={handleBuyerPrint} handlePrintClick={handlePrintClick} />
      )}
    </div>
  );
};

export default Buyer;
