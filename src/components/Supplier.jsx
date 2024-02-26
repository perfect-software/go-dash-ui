import React, { useState, useEffect } from "react";
import styles from "../styles/inputDetails.module.css";
import SupplierProvidedDetails from "./SupplierProvidedDetails";
import Currencydata from "currency-codes/data";
import { Country, State, City } from "country-state-city";
import { postApiService } from "../service/apiService";
import Downshift from "downshift";
const Supplier = () => {
  const [activeButton, setActiveButton] = useState("details");
  const [tempList, setTempList] = useState({
    countryList: [],
    stateList: [],
    cityList: [],
    currencyList: [],
  });
  const [allCountries, setAllCountires] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [location, setLocation] = useState({
    country: "",
    state: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    country: false,
    state: false,
    city: false,
    currency: false,
  });
  useEffect(() => {
    const toggleActiveButton = (event) => {
      if (event.code === "ControlRight") {
        setActiveButton((prevButton) =>
          prevButton === "details" ? "providedDetails" : "details"
        );

      }
    };
    window.addEventListener("keydown", toggleActiveButton);
    return () => {
      window.removeEventListener("keydown", toggleActiveButton);
    };
  }, [activeButton]);
  const handleSupplierFormChange = (e) => {
    const { name, value } = e.target;

    setSupplierForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [supplierForm, setSupplierForm] = useState(() => {
    const savedForm = localStorage.getItem("supplierForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          supplierName: "",
          billingAddress: "",
          deliveryAddress: "",
          phone: "",
          mobile: "",
          email: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          contactPerson: "",
          mobileExt: "",
          currency: "",
        };
  });
  useEffect(() => {
    localStorage.setItem("supplierForm", JSON.stringify(supplierForm));
  }, [supplierForm]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const validatePhoneNumber = (number) => {
    if (number) {
      return /^\d{10}$/.test(number);
    }
    return true;
  };
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
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  useEffect(() => {
    getCurrency();
  }, []);

  const resetAllFields = () => {
    setSupplierForm({
         supplierName: "",
          billingAddress: "",
          deliveryAddress: "",
          phone: "",
          mobile: "",
          email: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          contactPerson: "",
          mobileExt: "",
          currency: "",
    });
   
    localStorage.setItem(
      "supplierForm",
      JSON.stringify(supplierForm)
    );
  };


  const handleSupplierSubmit = async (e)=>{
       e.preventDefault();
       setLoading(true);
       const BASE_URL = 'supplier/create';
       try {
        const response = await postApiService(supplierForm,BASE_URL)
        togglePopup(response.message);
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




  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setSupplierForm({ ...supplierForm, [name]: value });

    if (value.length < 1) {
      toggleSuggestVisibility(`${name}`, false);
    }
    if (name === "country" && value.length >= 2) {
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

      toggleSuggestVisibility("country", true);
    } else if (name === "state" && value.length >= 2) {
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

      toggleSuggestVisibility("state", true);
    } else if (name === "city" && value.length >= 2) {
      if (allCities.length === 0) {
        setAllCities(City.getCitiesOfState(location.country, location.state));
      }
      const filteredCity = allCities
        .filter((city) => city.name.toLowerCase().includes(value.toLowerCase()))
        .map((city) => ({
          name: city.name,
        }));
      setTempList({ ...tempList, cityList: filteredCity });

      toggleSuggestVisibility("city", true);
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
  };

  const downshiftCountry = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSupplierForm({
            ...supplierForm,
            country: selectedItem.name,
          });
          toggleSuggestVisibility("country", false);
          setLocation({
            ...location,
            country: selectedItem.isoCode,
          });
        }
      }}
      selectedItem={supplierForm.country}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "country",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.country}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.country &&
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
          setSupplierForm({
            ...supplierForm,
            state: selectedItem.name,
          });
          toggleSuggestVisibility("state", false);
          setLocation({ ...location, state: selectedItem.isoCode });
        }
      }}
      selectedItem={supplierForm.state}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "state",
            })}
            type="text"
            disabled={!supplierForm.country}
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.state}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.state &&
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
          setSupplierForm({
            ...supplierForm,
            city: selectedItem.name,
          });
          toggleSuggestVisibility("city", false);
        }
      }}
      selectedItem={supplierForm.city}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "city",
            })}
            type="text"
            disabled={
              !supplierForm.country || !supplierForm.state
            }
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.city}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.city &&
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
          setSupplierForm({
            ...supplierForm,
            currency: selectedItem.code,
          });
          toggleSuggestVisibility("currency", false);
        }
      }}
      selectedItem={supplierForm.currency}
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
            placeholder="Insert Two Letter"
            value={supplierForm.currency}
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

  return (
    <div className={styles.supplierContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Supplier Directory</h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Supplier Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "providedDetails" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("providedDetails")}
            >
              Supplier Provided Details
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          {" "}
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={supplierForm.supplierName}
                  name="supplierName"
                  onChange={handleSupplierFormChange}
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
                  value={supplierForm.email}
                  name="email"
                  onChange={handleSupplierFormChange}
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="country">
                  Country
                </label>
                {downshiftCountry}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="city">
                  State
                </label>
                {downshiftState}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="city">
                  City
                </label>
                {downshiftCity}
              </div>
  

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Pincode
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Pincode"
                  value={supplierForm.pincode}
                  name="pincode"
                  onChange={handleSupplierFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Contact Person
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter Name"
                  value={supplierForm.contactPerson}
                  name="contactPerson"
                  onChange={handleSupplierFormChange}
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Billing Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  value={supplierForm.billingAddress}
                  name="billingAddress"
                  onChange={handleSupplierFormChange}
                />
              </div>
             

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="mobileExt">
                  MobileExt
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Mobile Ext"
                  value={supplierForm.mobileExt}
                  name="mobileExt"
                  onChange={handleSupplierFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Mobile Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Mobile Number"
                  value={supplierForm.mobile}
                  name="mobile"
                  onChange={handleSupplierFormChange}
                  style={
                    !validatePhoneNumber(supplierForm.mobile)
                      ? { border: "2px solid red" }
                      : {}
                  }
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Delivery Address
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Address"
                  value={supplierForm.deliveryAddress}
                  name="deliveryAddress"
                  onChange={handleSupplierFormChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Phone Number"
                  value={supplierForm.phone}
                  name="phone"
                  onChange={handleSupplierFormChange}
                  style={
                    !validatePhoneNumber(supplierForm.phone)
                      ? { border: "2px solid red" }
                      : {}
                  }
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="currency">
                  Currency
                </label>
                {downshiftCurrency}
              </div>
            </div>{" "}
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
          
                  onClick={handleSupplierSubmit}
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
        <SupplierProvidedDetails />
      )}
    </div>
  );
};

export default Supplier;
