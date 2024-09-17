import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import Currencydata from "currency-codes/data";
import tableStyles from "../../styles/bom.module.css";
import BuyerPopup from "../../popups/BuyerPopup";
import { getApiService } from "../../service/apiService";

const BuyerDetails = () => {
  const [newItem, setNewItem] = useState({
    buyer:'',
    currency:"",
  });
  const [currencyList, setCurrencyList] = useState([]);
  const handleAddMaterial = () => {
    setRowData([...rowData, newItem]);
    setNewItem({ code: '', head: '', percent: '', rate: '' });
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
  const [tempList, setTempList] = useState({
  
    currencyList: [],
  });
  useEffect(() => {
    getCurrency();
  }, []);

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;

    setNewItem({ ...newItem, [name]: value });

    if (value.length < 1) {
      toggleSuggestVisibility(`${name}`, false);
    }
     if (name === "currency" && value.length >= 2) {
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
 //   setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const handleRemoveItem = (code) => {
    setRowData(rowData.filter((item) => item.code !== code));
  };
  const [showInputLoading, setShowInputLoading] = useState({
    buyer:false,
    currency:false
  });
  const [showSuggestions, setShowSuggestions] = useState({
    currency:false,
    buyer:false
  });
  const [buyers, setBuyers] = useState([]);
  const handleBuyerInputChange = async (e) => {
    const { name, value } = e.target;
   setNewItem({ ...newItem, buyer: value });
    if (value.length >= 3) {
      toggleInputLoaderVisibility("buyer", true);
      const BASE_URL = `sample/getBuyer?input=${encodeURIComponent(value)}`;
      try {
        const fetchedBuyers = await getApiService(BASE_URL);
        setBuyers(fetchedBuyers);
        toggleSuggestVisibility("buyer", true);
        toggleInputLoaderVisibility("buyer", false);
      } catch (error) {
        console.error("Failed to fetch buyers:", error);
      } finally {
        toggleInputLoaderVisibility("buyer", false);
      }
    } else {
      toggleSuggestVisibility("buyer", false);
    }
   // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const handleBuyerSubmit = (selectedBuyers) => {
    if (Array.isArray(selectedBuyers) && selectedBuyers.length > 0) {
      const selectedBuyer = selectedBuyers[0];
      //setBsId(selectedBuyer.bs_id);
      setNewItem({
        ...newItem,
        buyer: selectedBuyer.bsName,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
 //   setValidation((prev) => ({ ...prev, bsName: "valid" }));
  };
  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setNewItem({
            ...newItem,
            buyer: selectedItem.bsName,
          });
        //  setBsId(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={newItem.buyer}
      itemToString={(item) => (item ? item.buyer : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleBuyerInputChange,
              name: "buyer",
            })}
            type="text"
            // style={
            //   validation.buyer === "invalid" ? { border: "2px solid red" } : {}
            // }
            className={styles.basicInput2}
            placeholder="Type 3 words"
            value={newItem.buyer}
          />
         {showInputLoading.buyer ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
               // disabled={isEditClicked}
                onClick={() => setIsBuyerPopup(true)}
                className={styles.searchBtn}
                aria-label="Search"
              ></button>{" "}
            </div>
          )}


          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyer &&
              buyers.map((buyer, index) => (
                <div
                  {...getItemProps({ key: buyer.bsId, index, item: buyer })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {buyer.bsName}
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
          setNewItem({
            ...newItem,
            currency: selectedItem.code,
          });
          toggleSuggestVisibility("currency", false);
        }
      }}
      selectedItem={newItem.currency}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCurrencyChange,
              name: "currency",
            })}
            type="text"
            className={styles.basicInput}
            // style={
            //   validation.currency === "invalid" ? { border: "2px solid red" } : {}
            // }
            placeholder="Insert Two Letter"
            value={newItem.currency}
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
    <>
      <div className={styles.topGrid}>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Buyer Order No.
          </label>
          <input
            name="head"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.head}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Buyer Date
          </label>
          <input
            name="percent"
            type="date"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
             value={newItem.percent}
          />
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Buyer Style
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Buyer Group
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Buyer Name
          </label>
         {downshiftBuyer}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Currency
          </label>
          {downshiftCurrency}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Current Rate
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Brand
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
          Per Pair Rate
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
         Destination
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
          Color Desc.
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
          Payment terms
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
          />
        </div>
      </div>
      {isBuyerPopup && (
            <BuyerPopup
              onCancel={() => {
                setIsBuyerPopup(false);
              }}
              onSubmitBuyerData={handleBuyerSubmit}
            />
          )}
    </>
  );
};

export default BuyerDetails;
