import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import tableStyles from "../styles/bom.module.css";
import {
  getApiService,
  getDataApiService,
  postApiService,
  putApiService,
} from "../service/apiService";
import { generatePDF } from "../features/generateBomPDF";
import InventoryCheckPopup from "../popups/InventoryCheckPopup";
import Downshift from "downshift";
import { useDispatch, useSelector } from "react-redux";
import GraphAverage from "./productionBomPages/GraphAverage";
import Comments from "./productionBomPages/Comment";
import { fetchAllBom } from "../reducer/bomSlice";
import SizeRoles from "./productionBomPages/SizeRole";
import Specifications from "./productionBomPages/Specification";
import ViewProductionBom from "./ViewProductionBom";
import Grading from "./productionBomPages/Grading";
import BuyerPopup from "../popups/BuyerPopup";
import { fetchAllItemHeads } from "../reducer/itemHeadSlice";
import BuyerDetails from "./productionBomPages/Specification";
const ProductionBom = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [srList, setSrList] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [filteredsrList, setfilteredSrList] = useState([]);
  const initialValidationState = {};
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditSelected, setIsEditSelected] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [productionBomDetails, setProductionBomDetails] = useState([]);
  const [editDetails, setEditDetails] = useState(null);
  const [tempProductionBomDetails, setTempProductionBomDetails] =
    useState(null);
  const [validation, setValidation] = useState(initialValidationState);
  const [activeButton, setActiveButton] = useState("details");
  const [isInventoryPopup, setIsInventoryPopup] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const [colors, setColors] = useState([]);
  const [productionBomData, setProductionBomData] = useState({
    sr_no: "",
    articleNo: "",
    productionBomType: "",
    buyerName: "",
    season: "",
    color: "",
    extraQty: "",
    totalQty: "",
    groups: [],
    grading: [],
    comments: [],
    buyerDetails: [],
    sizeRoles: [],
  });
  const [tempList, setTempList] = useState({
    seasonList: [],
  });
  const dispatch = useDispatch();
  const [showInputLoading, setShowInputLoading] = useState({
    sr_no: false,
    season: false,
    buyer: false,
    color: false,
  });
  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setProductionBomData({ ...productionBomData, [name]: value });
    if (value.length >= 2) {
      toggleInputLoaderVisibility(`${name}`, true);
      const BASE_URL = `sample/color/{input}?input=${encodeURIComponent(
        value
      )}`;

      try {
        const fetchedColors = await getApiService(BASE_URL);
        setColors(fetchedColors);
        toggleInputLoaderVisibility(`${name}`, false);
        toggleSuggestVisibility(`${name}`, true);
      } catch (error) {
        console.error("Failed to fetch Colors:", error);
      } finally {
        toggleInputLoaderVisibility(`${name}`, false);
      }
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
    // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = ["sr_no", "articleNo", "buyerName"];

    requiredFields.forEach((field) => {
      if (!productionBomData[field] || productionBomData[field].trim() === "") {
        isValid = false;
        newValidation[field] = "invalid";
      } else {
        newValidation[field] = "valid";
      }
    });

    setValidation(newValidation);
    return isValid;
  };
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  const handleBuyerSubmit = (selectedBuyers) => {
    if (Array.isArray(selectedBuyers) && selectedBuyers.length > 0) {
      const selectedBuyer = selectedBuyers[0];
      //setBsId(selectedBuyer.bs_id);
      setProductionBomData({
        ...productionBomData,
        buyer: selectedBuyer.bsName,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
    //   setValidation((prev) => ({ ...prev, bsName: "valid" }));
  };

  const [showSuggestions, setShowSuggestions] = useState({
    sr_no: false,
    season: false,
    color: false,
    buyer: false,
  });
  const [buyers, setBuyers] = useState([]);
  const [activePage, setActivePage] = useState("graphAverage");
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const handleButtonClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    setfilteredSrList(srList);
    toggleInputLoaderVisibility(`${name}`, false);
    toggleSuggestVisibility(name, !showSuggestions[name]);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handleSampleNoChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setProductionBomData({ ...productionBomData, sr_no: value });
    toggleSuggestVisibility(name, value.length > 0);
    const filteredItems = srList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredSrList(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const sampleRef = useRef(null);
  const downshiftsampleRef = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          toggleSuggestVisibility("sr_no", false);
          setProductionBomData({ ...productionBomData, sr_no: selectedItem });
          fetchBySrNo(selectedItem);
        }
      }}
      selectedItem={productionBomData.sr_no}
      itemToString={(item) => (item ? item.sr_no : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleNoChange,
              name: "sr_no",
            })}
            type="text"
            ref={sampleRef}
            style={
              validation.sr_no === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={productionBomData.sr_no}
          />

          {showInputLoading.sr_no ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("sr_no");
                sampleRef.current?.focus();
              }}
              className={tableStyles.searchBtn}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions.sr_no && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredsrList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );

  useEffect(() => {
    fetchSRNo();
  }, []);

  const fetchSRNo = async () => {
    const BASE_URL = "productionBom/getSrNoList";
    const response = await getApiService(BASE_URL);
    setSrList(response);
  };
  const fetchProductionBomDetails = async (productionBomId) => {
    try {
      if (productionBomId) {
        const BASE_URL = "productionBom/viewproductionBomdetails";
        const response = await getDataApiService(
          { productionBomId: productionBomId },
          BASE_URL
        );
        return response;
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
    }
  };

  const handleBOMEdit = (productionBom) => {
    setIsEditSelected(false);
    if (productionBom) {
      setIsEditSelected(true);
      setTempProductionBomDetails(productionBom);
    }
  };
  const handleEditClick = async () => {
    setIsEditClicked(true);
    setUpdateLoading(true);
    setActiveButton("details");
    await fetchBySrNo(tempProductionBomDetails[0].srno);
    try {
      const response = await fetchProductionBomDetails(
        tempProductionBomDetails[0].productionBomId
      );
      if (response) {
        setEditDetails(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleProductionBomChange = (e) => {
    const { name, value } = e.target;
    setProductionBomData({
      ...productionBomData,
      [name]: value,
    });
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const fetchBySrNo = async (SRNo) => {
    toggleInputLoaderVisibility("sr_no", true);
    try {
      const BASE_URL = "bom/getSamplebySrNo";
      const response = await getDataApiService({ srno: SRNo }, BASE_URL);
      setProductionBomData({
        ...productionBomData,
        buyerName: response.buyerName,
        articleNo: response.articleNo,
        sr_no: SRNo,
      });
      if (response.buyerName) {
        setValidation((prev) => ({ ...prev, buyerName: "valid" }));
      }
      if (response.articleNo) {
        setValidation((prev) => ({ ...prev, articleNo: "valid" }));
      }
    } catch (error) {
      console.error(error);
      togglePopup("Failed To Fetch");
    } finally {
      toggleInputLoaderVisibility("sr_no", false);
    }
  };

  const resetAllFields = () => {
    setProductionBomData({
      sr_no: "",
      articleNo: "",
      buyerName: "",
      productionBomType: "",
    });
    setValidation(initialValidationState);
    setResetTrigger(true);
  };

  const handleViewPDF = async () => {
    const jsonData = JSON.stringify(productionBomData);
    console.log(jsonData);
    await generatePDF(productionBomData);
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const prepareDataForSubmission = (productionBomData) => {
    const transformedData = {
      ...productionBomData,

      groups: productionBomData.groups.map((group) => ({
        itemgrp: group.id,
        subgroups: group.subgroups.map((subgroup) => ({
          itemsubgrp: subgroup.id,
          items: subgroup.items.map((item) => ({
            itemId: item.itemId,
            usedIn: item.usedIn,
            pair: item.pair,
            supplierId: item.supplierId,
            stockConsumedQty: item.stockConsumedQty,
            productionBomQty: item.productionBomQty,
            unit: item.unit,
            requiredQty: item.requiredQty,
            rate: item.rate,
          })),
        })),
      })),
    };

    return transformedData;
  };

  const handleUpdateProductionBomClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const dataToSubmit = await prepareDataForSubmission(productionBomData);
    const updatedForm = {
      ...dataToSubmit,
      productionBomId: tempProductionBomDetails[0].productionBomId,
    };
    console.log(updatedForm);
    const BASE_URL = "productionBom/update";
    try {
      const responseData = await putApiService(updatedForm, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllProductionBom());
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
  const { itemHeads, itemLoaded, itemLoading, error } = useSelector(
    (state) => state.itemHead
  );

  useEffect(() => {
    if (!itemLoaded && !itemLoading) {
      dispatch(fetchAllItemHeads());
    }
  }, [itemLoaded, itemLoading, dispatch]);

  const handleDropItemChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setProductionBomData({ ...productionBomData, [name]: value });
    const concatenatedString = `${name}List`;
    const filtered = itemHeads
      .filter(
        (item) =>
          item.head.toLowerCase() === name.toLowerCase() &&
          item.value.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => ({
        name: item.value,
      }));
    const updatedList = {
      ...tempList,
      [concatenatedString]: filtered,
    };
    setTempList(updatedList);
    toggleInputLoaderVisibility(`${name}`, false);
    if (value.length > 0) {
      toggleSuggestVisibility(`${name}`, true);
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
    // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleSubmitProductionBomClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    // if (!validateForm()) {
    //   setLoading(false);
    //   return;
    // }
    const dataToSubmit = await prepareDataForSubmission(productionBomData);
    console.log(dataToSubmit);
    const BASE_URL = "productionBom/create";
    try {
      const responseData = await postApiService(dataToSubmit, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllProductionBom());
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
  const handleBuyerInputChange = async (e) => {
    const { name, value } = e.target;
    setProductionBomData({ ...productionBomData, buyer: value });
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

  const handleDropItemClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    const concatenatedString = `${name}List`;
    const filtered = itemHeads
      .filter((item) => item.head.toLowerCase() === name.toLowerCase())
      .map((item) => ({
        name: item.value,
      }));

    const updatedList = {
      ...tempList,
      [concatenatedString]: filtered,
    };
    setTempList(updatedList);
    toggleSuggestVisibility(name, !showSuggestions[name]);
    toggleInputLoaderVisibility(`${name}`, false);
    // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setProductionBomData({
            ...productionBomData,
            buyer: selectedItem.bsName,
          });
          //  setBsId(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={productionBomData.buyer}
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
            style={
              validation.buyer === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput2}
            placeholder="Type 3 words"
            value={productionBomData.buyer}
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
  const seasonInputRef = useRef(null);
  const downshiftSeason = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setProductionBomData({
            ...productionBomData,
            season: selectedItem.name,
          });
          toggleSuggestVisibility("season", false);
        }
      }}
      selectedItem={productionBomData.season}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleDropItemChange,
              name: "season",
            })}
            type="text"
            maxLength="20"
            ref={seasonInputRef}
            className={styles.buttonBasicInput}
            placeholder="Insert First Letter"
            value={productionBomData.season}
          />

          {showInputLoading.season ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                onClick={() => {
                  handleDropItemClick("season");
                  seasonInputRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="dropDorn"
              ></button>{" "}
            </div>
          )}

          {showSuggestions.season && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {tempList.seasonList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
  const downshiftColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setProductionBomData({
            ...productionBomData,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
          // setValidation((prev) => ({ ...prev, color: "valid" }));
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={productionBomData.color}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "color",
            })}
            type="text"
            className={styles.buttonBasicInput}
            style={
              validation.color === "invalid" ? { border: "2px solid red" } : {}
            }
            placeholder="Type "
            value={productionBomData.color}
          />
          {showInputLoading.color && <div className={styles.dropLoader}></div>}
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.color &&
              colors.map((color, index) => (
                <div
                  {...getItemProps({ key: index, index, item: color })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {color}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  return (
    <div className={styles.BOMContainer}>
      <div className={styles.headContainer}>
        <div className={styles.BOMSubHeadContainer}>
          <h1
            className={styles.sampleRequestheadText}
            style={activeButton === "view" ? { marginTop: "2px" } : {}}
          >
            {activeButton === "details"
              ? isEditClicked
                ? `Update Production BOM: ${
                    isEditClicked &&
                    tempProductionBomDetails[0].productionBomId &&
                    tempProductionBomDetails[0].productionBomId
                  }`
                : "Production BOM"
              : "Production BOM Search"}
          </h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={styles.topButtons}>
              <button
                className={`${styles.screenChangeButton} ${
                  activeButton === "details" ? styles.active : ""
                }`}
                onClick={() => setActiveButton("details")}
              >
                BOM Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activeButton === "view" ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveButton("view");
                  {
                  }
                }}
              >
                View BOM
              </button>
            </div>
            <div className={styles.editContainer}>
              {/* {activeButton === "view" && (
                <div className={styles.editContainer}>
                  {updateLoading ? (
                    <div className={styles.buttonContainer}>
                      <div className={styles.loader}></div>
                    </div>
                  ) : (
                    <button
                      disabled={!isEditSelected}
                      className={styles.headButton}
                      onClick={handleEditClick}
                    >
                      Update
                    </button>
                  )}
                  <button className={styles.headButton} onClick={handleViewPDF}>
                    Print
                  </button>
                </div>
              )} */}
              {activeButton === "details" && (
                <div className={styles.editContainer}>
                  <button
                    className={styles.headButtonPrint}
                    onClick={() => {
                      setIsInventoryPopup(true);
                    }}
                  >
                    Inventory
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.headBorder}></div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topGrid}>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleName">
                W. Order
              </label>
              {downshiftsampleRef}
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                FO NO.
              </label>
              <input
                type="text"
                name="productionBomType"
                className={styles.basicInput}
                placeholder="BOM Type"
                onChange={handleProductionBomChange}
                value={productionBomData.productionBomType}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Date
              </label>
              <input
                type="date"
                name="date"
                className={styles.basicInput}
                placeholder="dte"
                onChange={handleProductionBomChange}
                value={productionBomData.date}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="city">
                Size Pattern
              </label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.selectInput}
                  value={productionBomData.sizePattern}
                  name="type"
                  // style={
                  //   validation.type === "invalid" ? { border: "2px solid red" } : {}
                  // }
                  onChange={handleProductionBomChange}
                >
                  <option value="" selected disabled hidden>
                    Select Type
                  </option>
                  <option value="UK">UK</option>
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                </select>
              </div>
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="season">
                Season
              </label>
              {downshiftSeason}
            </div>

            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="season">
                BOM Serial
              </label>
              {downshiftsampleRef}
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Port Date
              </label>
              <input
                type="date"
                name="date"
                className={styles.basicInput}
                placeholder="dte"
                onChange={handleProductionBomChange}
                value={productionBomData.date}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Ex Factory Date
              </label>
              <input
                type="date"
                name="date"
                className={styles.basicInput}
                placeholder="dte"
                onChange={handleProductionBomChange}
                value={productionBomData.date}
              />
            </div>
            <div className={styles.colSpan2}>
              <label className={styles.impsampleLabel} htmlFor="buyer">
                Buyer Name
              </label>
              {downshiftBuyer}
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                Article No
              </label>
              <input
                type="text"
                name="articleNo"
                className={styles.basicInput}
                placeholder="Article No"
                style={
                  validation.articleNo === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleProductionBomChange}
                value={productionBomData.articleNo}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Sample Size
              </label>
              <input
                type="number"
                name="size"
                className={styles.basicInput}
                placeholder="size"
                onChange={handleProductionBomChange}
                value={productionBomData.size}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Art.Color
              </label>
              {downshiftColor}
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Total Qty.
              </label>
              <input
                type="number"
                name="totalQty"
                className={styles.basicInput}
                placeholder="totalQty"
                onChange={handleProductionBomChange}
                value={productionBomData.totalQty}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Total Extra Qty.
              </label>
              <input
                type="number"
                name="extraQty"
                className={styles.basicInput}
                placeholder="extraQty"
                onChange={handleProductionBomChange}
                value={productionBomData.extraQty}
              />
            </div>
          </div>
          <div className={styles.middleContainerBottom}>
            <div className={styles.topButtons}>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "graphAverage" ? styles.active : ""
                }`}
                onClick={() => setActivePage("graphAverage")}
              >
                Graph Average
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "grading" ? styles.active : ""
                }`}
                onClick={() => setActivePage("grading")}
              >
                Grading
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "comment" ? styles.active : ""
                }`}
                onClick={() => setActivePage("comment")}
              >
                Comment
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "buyerDetails" ? styles.active : ""
                }`}
                onClick={() => setActivePage("buyerDetails")}
              >
                Buyer Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "size" ? styles.active : ""
                }`}
                onClick={() => setActivePage("size")}
              >
                Size Roll
              </button>
            </div>
          </div>
          <div className={styles.headBorder}></div>
          {activePage == "graphAverage" && (
            <div>
              <div className={styles.materialTableContainer}>
                <GraphAverage
                  productionBomData={productionBomData}
                  setProductionBomData={setProductionBomData}
                  editDetails={editDetails}
                  setEditDetails={setEditDetails}
                  resetTrigger={resetTrigger}
                  onResetDone={() => setResetTrigger(false)}
                />
              </div>
            </div>
          )}

          {activePage === "grading" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Grading
                productionBomData={productionBomData}
                setProductionBomData={setProductionBomData}
                editDetails={editDetails}
                setEditDetails={setEditDetails}
                resetTrigger={resetTrigger}
                onResetDone={() => setResetTrigger(false)} 
                />
              </div>
            </div>
          )}

          {activePage === "comment" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Comments
                productionBomData={productionBomData}
                setProductionBomData={setProductionBomData}
                editDetails={editDetails}
                setEditDetails={setEditDetails}
                resetTrigger={resetTrigger}
                onResetDone={() => setResetTrigger(false)} 
                />
              </div>
            </div>
          )}

          {activePage === "size" && (
            <div>
              <div className={styles.materialTableContainer}>
                <SizeRoles
                productionBomData={productionBomData}
                setProductionBomData={setProductionBomData}
                editDetails={editDetails}
                setEditDetails={setEditDetails}
                resetTrigger={resetTrigger}
                onResetDone={() => setResetTrigger(false)} 
                />
              </div>
            </div>
          )}

          {activePage === "buyerDetails" && (
            <div>
              <div className={styles.materialTableContainer}>
                <BuyerDetails
                productionBomData={productionBomData}
                setProductionBomData={setProductionBomData}
                editDetails={editDetails}
                setEditDetails={setEditDetails}
                resetTrigger={resetTrigger}
                onResetDone={() => setResetTrigger(false)} 
                />
              </div>
            </div>
          )}
          <div className={styles.parentButtonContainer}>
            {loading ? (
              <div className={styles.buttonContainer}>
                <div className={styles.loader}></div>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                {isEditClicked ? (
                  <>
                    <button
                      onClick={handleUpdateProductionBomClick}
                      className={styles.submitButton}
                    >
                      Submit
                    </button>{" "}
                    <button
                      className={styles.resetButton}
                      onClick={() => {
                        resetAllFields();
                        setIsEditClicked(false);
                        setIsEditSelected(false);
                      }}
                    >
                      Go Back
                    </button>
                  </>
                ) : (
                  <>
                    {" "}
                    <button
                      className={styles.resetButton}
                      onClick={resetAllFields}
                    >
                      Reset
                    </button>
                    <button
                      className={styles.submitButton}
                      disabled={
                        productionBomData.groups &&
                        !productionBomData.groups.length > 0
                      }
                      onClick={handleSubmitProductionBomClick}
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          {" "}
          <ViewProductionBom onBOMSelect={handleBOMEdit} handleEditClick={handleEditClick} handleViewPDF={handleViewPDF} />
        </div>
      )}

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
      {isInventoryPopup && (
        <InventoryCheckPopup
          onCancel={() => {
            setIsInventoryPopup(false);
          }}
        />
      )}
      {isBuyerPopup && (
        <BuyerPopup
          onCancel={() => {
            setIsBuyerPopup(false);
          }}
          onSubmitBuyerData={handleBuyerSubmit}
        />
      )}
    </div>
  );
};

export default ProductionBom;
