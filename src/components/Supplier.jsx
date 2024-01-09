import React, { useState, useEffect } from "react";
import styles from "../styles/supplier.module.css";
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
  const [allCities, setAllCities] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [location, setLocation] = useState({
    country: "",
    state: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    supplierCountry: false,
    supplierState: false,
    supplierCity: false,
    currency: false,
  });

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
          supplierAbbriviation: "",
          supplierBillingAddress: "",
          supplierShippingAddress: "",
          supplierPhone: "",
          supplierMobile: "",
          supplierEmail: "",
          supplierCity: "",
          supplierState: "",
          supplierCountry: "",
          supplierPincode: "",
          supplierType: "",
          supplierContactPerson: "",
          merchendiser: "",
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
  useEffect(() => {
    getCurrency();
  }, []);

  const resetAllFields = () => {
    setSupplierForm({
      supplierName: "",
          supplierAbbriviation: "",
          supplierBillingAddress: "",
          supplierShippingAddress: "",
          supplierPhone: "",
          supplierMobile: "",
          supplierEmail: "",
          supplierCity: "",
          supplierState: "",
          supplierCountry: "",
          supplierPincode: "",
          supplierType: "",
          supplierContactPerson: "",
          merchendiser: "",
          currency: "",
    });
   
    localStorage.setItem(
      "supplierForm",
      JSON.stringify(supplierForm)
    );
  };







  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setSupplierForm({ ...supplierForm, [name]: value });

    if (value.length < 1) {
      toggleSuggestVisibility(`${name}`, false);
    }
    if (name === "supplierCountry" && value.length >= 2) {
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

      toggleSuggestVisibility("supplierCountry", true);
    } else if (name === "supplierState" && value.length >= 2) {
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

      toggleSuggestVisibility("supplierState", true);
    } else if (name === "supplierCity" && value.length >= 2) {
      if (allCities.length === 0) {
        setAllCities(City.getCitiesOfState(location.country, location.state));
      }
      const filteredCity = allCities
        .filter((city) => city.name.toLowerCase().includes(value.toLowerCase()))
        .map((city) => ({
          name: city.name,
        }));
      setTempList({ ...tempList, cityList: filteredCity });

      toggleSuggestVisibility("supplierCity", true);
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
            supplierCountry: selectedItem.name,
          });
          toggleSuggestVisibility("supplierCountry", false);
          setLocation({
            ...location,
            country: selectedItem.isoCode,
          });
        }
      }}
      selectedItem={supplierForm.supplierCountry}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "supplierCountry",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.supplierCountry}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.supplierCountry &&
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
            supplierState: selectedItem.name,
          });
          toggleSuggestVisibility("supplierState", false);
          setLocation({ ...location, state: selectedItem.isoCode });
        }
      }}
      selectedItem={supplierForm.supplierState}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "supplierState",
            })}
            type="text"
            disabled={!supplierForm.supplierCountry}
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.supplierState}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.supplierState &&
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
            supplierCity: selectedItem.name,
          });
          toggleSuggestVisibility("supplierCity", false);
        }
      }}
      selectedItem={supplierForm.supplierCity}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleLocationChange,
              name: "supplierCity",
            })}
            type="text"
            disabled={
              !supplierForm.supplierCountry || !supplierForm.supplierState
            }
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={supplierForm.supplierCity}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.supplierCity &&
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
                <label className={styles.sampleLabel} htmlFor="input1">
                  Abbreviation
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter here "
                  value={supplierForm.supplierAbbriviation}
                  name="supplierAbbriviation"
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
                  value={supplierForm.supplierEmail}
                  name="supplierEmail"
                  onChange={handleSupplierFormChange}
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
                  value={supplierForm.merchendiser}
                  name="merchendiser"
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
                <label className={styles.sampleLabel} htmlFor="city">
                  Supplier Type
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={supplierForm.supplierType}
                    name="supplierType"
                    onChange={handleSupplierFormChange}
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
                <label className={styles.sampleLabel} htmlFor="supplier">
                  Pincode
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Pincode"
                  value={supplierForm.supplierPincode}
                  name="supplierPincode"
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
                  value={supplierForm.supplierBillingAddress}
                  name="supplierBillingAddress"
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
                  placeholder="Address"
                  value={supplierForm.supplierContactPerson}
                  name="supplierContactPerson"
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
                  value={supplierForm.supplierMobile}
                  name="supplierMobile"
                  onChange={handleSupplierFormChange}
                  style={
                    !validatePhoneNumber(supplierForm.supplierMobile)
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
                  value={supplierForm.supplierShippingAddress}
                  name="supplierShippingAddress"
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
                  value={supplierForm.supplierPhone}
                  name="supplierPhone"
                  onChange={handleSupplierFormChange}
                  style={
                    !validatePhoneNumber(supplierForm.supplierPhone)
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
          <div className={styles.buttonContainer}>
            <button className={styles.resetButton} onClick={resetAllFields}>Reset</button>
            <button className={styles.submitButton}>Submit</button>
          </div>
        </>
      ) : (
        <SupplierProvidedDetails />
      )}
    </div>
  );
};

export default Supplier;
