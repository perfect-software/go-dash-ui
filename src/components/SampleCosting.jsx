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
import GraphAverage from "./sampleCostingPages/GraphAverage";
import Comments from "./sampleCostingPages/Comment";
import { fetchAllBom } from "../reducer/bomSlice";
import SizeRoles from "./sampleCostingPages/SizeRole";
import Specifications from "./sampleCostingPages/Specification";
import OverHead from "./sampleCostingPages/OverHead";
import BuyerPopup from "../popups/BuyerPopup";
import { fetchAllItemHeads } from "../reducer/itemHeadSlice";
const SampleCosting = () => {
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
  const [sampleCostingDetails, setSampleCostingDetails] = useState([]);
  const [editDetails, setEditDetails] = useState(null);
  const [tempSampleCostingDetails, setTempSampleCostingDetails] = useState(null);
  const [validation, setValidation] = useState(initialValidationState);
  const [activeButton, setActiveButton] = useState("details");
  const [isInventoryPopup, setIsInventoryPopup] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const [colors, setColors] = useState([]);
  const [sampleCostingData, setSampleCostingData] = useState(() => {
    const savedData = localStorage.getItem("sampleCostingData");
    return savedData ? JSON.parse(savedData) : {
      articleNo: "",
      buyer: "",
      season: "",
      color: "",
      size: "",
      dateOfOrder: "",
      sampleType: "",
      gradingType: "",
      totalQty: "",
      extraQty: "",
      groups: [],
      overhead: [],
      comments:[],
      specifications:[],
      sizeRoles:[],
    };
  });

  useEffect(() => {
    localStorage.setItem("sampleCostingData", JSON.stringify(sampleCostingData));
  }, [sampleCostingData]);
  const [tempList, setTempList] = useState({
    seasonList:[],
  });
  const dispatch = useDispatch();
  const [showInputLoading, setShowInputLoading] = useState({
    season:false,
    buyer:false,
    sampleType:false,
    color:false,
  });
  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setSampleCostingData({ ...sampleCostingData, [name]: value });
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
   setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = ["sampleType", "articleNo", "buyer","gradingType"];

    requiredFields.forEach((field) => {
      if (!sampleCostingData[field] || sampleCostingData[field].trim() === "") {
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
      setSampleCostingData({
        ...sampleCostingData,
        buyer: selectedBuyer.bsName,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
    setValidation((prev) => ({ ...prev, bsName: "valid" }));
  };
  const [formattedDate, setFormattedDate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState({
    season:false,
    color:false,
    buyer:false,
    sampleType:false,
  });
  const [sampleType, setSampleType] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [activePage, setActivePage] = useState("graphAverage");
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    setFormattedDate(currentDate);
  }, []);
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
    setSampleCostingData({ ...sampleCostingData, sr_no: value });
    toggleSuggestVisibility(name, value.length > 0);
    const filteredItems = srList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredSrList(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  
  useEffect(() => {
    fetchSRNo();
  }, []);

  const fetchSRNo = async () => {
    const BASE_URL = "sampleCosting/getSrNoList";
    const response = await getApiService(BASE_URL);
    setSrList(response);
  };
  const fetchSampleCostingDetails = async (sampleCostingId) => {
    try {
      if (sampleCostingId) {
        const BASE_URL = "sampleCosting/viewsampleCostingdetails";
        const response = await getDataApiService({ sampleCostingId: sampleCostingId }, BASE_URL);
        return response;
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
    }
  };

  const handleBOMEdit = (sampleCosting) => {
    setIsEditSelected(false);
    if (sampleCosting) {
      setIsEditSelected(true);
      setTempSampleCostingDetails(sampleCosting);
    }
  };
  const handleEditClick = async () => {
    setIsEditClicked(true);
    setUpdateLoading(true);
    setActiveButton("details");
    await fetchBySrNo(tempSampleCostingDetails[0].srno);
    try {
      const response = await fetchSampleCostingDetails(tempSampleCostingDetails[0].sampleCostingId);
      if (response) {
        setEditDetails(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSampleCostingChange = (e) => {
    const { name, value } = e.target;
    setSampleCostingData({
      ...sampleCostingData,
      [name]: value,
    });
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const fetchBySrNo = async (SRNo) => {
    toggleInputLoaderVisibility("sr_no", true);
    try {
      const BASE_URL = "sampleCosting/getSamplebySrNo";
      const response = await getDataApiService({ srno: SRNo }, BASE_URL);
      setSampleCostingData({
        ...sampleCostingData,
        buyer: response.buyerName,
        articleNo: response.articleNo,
      });
      if (response.buyer) {
        setValidation((prev) => ({ ...prev, buyer: "valid" }));
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
  const handleSampleType = async (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    const BASE_URL = "sample/getSampleType";
    try {
      const fetchedType = await getApiService(BASE_URL);
      setSampleType(fetchedType);
      toggleInputLoaderVisibility(`${name}`, false);
    } catch (error) {
      console.error("Failed to fetch Sample Type:", error);
    } finally {
      toggleInputLoaderVisibility(`${name}`, false);
    }
    toggleSuggestVisibility(name, !showSuggestions[name]);
  };
  const resetAllFields = () => {
    setSampleCostingData({
      articleNo: "",
    buyer: "",
    season:"",
    color:"",
    size:"",
    sampleType:"",
    gradingType:"",
    totalQty:"",
    extraQty:"",
    });
    setValidation(initialValidationState);
   // setResetTrigger(true);
  };

  const handleViewPDF = async () => {
    const jsonData = JSON.stringify(sampleCostingData);
    console.log(jsonData);
    await generatePDF(sampleCostingData);
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const prepareDataForSubmission = (sampleCostingData) => {
    if (!sampleCostingData || !sampleCostingData.groups) {
      return {}; // or return any default value that makes sense in your context
    }
  
    const transformedData = {
      ...sampleCostingData,
      groups: sampleCostingData.groups.map((group) => ({
        itemgrp: group.id,
        subgroups: group.subgroups.map((subgroup) => ({
          itemsubgrp: subgroup.id,
          items: subgroup.items.map((item) => ({
            itemId: item.itemId,
            usedIn: item.usedIn,
            pair: item.pair,
            qty: item.qty,
            unit: item.unit,
            requiredQty: item.requiredQty,
            rate: item.rate,
          })),
        })),
      })),
    };
  
    return transformedData;
  };
  
 
  const handleUpdateSampleCostingClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const dataToSubmit = await prepareDataForSubmission(sampleCostingData);
    const updatedForm = {
      ...dataToSubmit,
      sampleCostingId: tempSampleCostingDetails[0].sampleCostingId,
    };
    console.log(updatedForm);
    const BASE_URL = "sampleCosting/update";
    try {
      const responseData = await putApiService(updatedForm, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllSampleCosting());
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
    setSampleCostingData({ ...sampleCostingData, [name]: value });
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
   setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleSubmitSampleCostingClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    // if (!validateForm()) {
    //   setLoading(false);
    //   return;
    // }
    const updatedSampleCostingData = {
      ...sampleCostingData,
      dateOfOrder: formattedDate,
    };
    const dataToSubmit = await prepareDataForSubmission(updatedSampleCostingData);
    const BASE_URL = "sampleCosting/create";
    console.log(dataToSubmit);
    try {
      const responseData = await postApiService(dataToSubmit, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllSampleCosting());
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
   setSampleCostingData({ ...sampleCostingData, buyer: value });
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
   setValidation((prev) => ({ ...prev, [name]: "valid" }));
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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleCostingData({
            ...sampleCostingData,
            buyer: selectedItem.bsName,
          });
          setValidation((prev) => ({ ...prev, buyer: "valid" }));
        //  setBsId(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={sampleCostingData.buyer}
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
            value={sampleCostingData.buyer}
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
  const sampleTypeRef = useRef(null);
  const downshiftSampleType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleCostingData({
            ...sampleCostingData,
            sampleType: selectedItem,
          });
         setValidation((prev) => ({ ...prev, sampleType: "valid" }));
          toggleSuggestVisibility("sampleType", false);
        }
      }}
      selectedItem={sampleCostingData.sampleType}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleCostingChange,
              name: "sampleType",
            })}
            type="text"
            ref={sampleTypeRef}
            className={styles.basicInput2}
            placeholder="Click on Search"
            style={
              validation.sampleType === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            value={sampleCostingData.sampleType}
            readOnly
          />
          {showInputLoading.sampleType ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              <button
                onClick={() => {
                  handleSampleType("sampleType");
                  sampleTypeRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="Search"
              ></button>
            </div>
          )}

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.sampleType &&
              sampleType.map((type, index) => (
                <div
                  {...getItemProps({ key: index, index, item: type })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {type}
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
          setSampleCostingData({
            ...sampleCostingData,
            season: selectedItem.name,
          });
          toggleSuggestVisibility("season", false);
        }
      }}
      selectedItem={sampleCostingData.season}
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
            value={sampleCostingData.season}
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
          setSampleCostingData({
            ...sampleCostingData,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
          setValidation((prev) => ({ ...prev, color: "valid" }));
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={sampleCostingData.color}
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
            value={sampleCostingData.color}
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
                ? `Update S.Costing: ${
                    isEditClicked &&
                    tempSampleCostingDetails[0].sampleCostingId &&
                    tempSampleCostingDetails[0].sampleCostingId
                  }`
                : "Sample Costing"
              : "Sample Costing Search"}
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
                Sample Costing Details
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
                View Sample Costing
              </button>
            </div>
            <div className={styles.editContainer}>
              {activeButton === "view" && (
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
              )}
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
                <label className={styles.sampleLabel} htmlFor="season">
                  Season
                </label>
                {downshiftSeason}
                </div>
                <div className={styles.colSpan}>
                  <label
                    className={styles.impsampleLabel}
                    htmlFor="dateOfOrder"
                  >
                    Date Of Order
                  </label>
                  <input
                    type="date"
                    className={`${styles.basicInput} ${styles.dateInput}`}
                    readOnly
                    defaultValue={formattedDate}
                    name="dateOfOrder"
                    style={{ backgroundColor: "#F7F7F7" }}
                  />
                </div>
           
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="size">
                Size
              </label>
              <input
                type="number"
                name="size"
                className={styles.basicInput}
                placeholder="BOM Type"
                onChange={handleSampleCostingChange}
                value={sampleCostingData.size}
              />
            </div>
            <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="sampleType">
                  Type of Sample
                </label>
                {downshiftSampleType}
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
                onChange={handleSampleCostingChange}
                value={sampleCostingData.articleNo}
              />
            </div>
           
         
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Color
              </label>
            {downshiftColor}
            </div>
            <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                  Grading Type
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={sampleCostingData.gradingType}
                    name="gradingType"
                    style={
                      validation.gradingType === "invalid" ? { border: "2px solid red" } : {}
                    }
                    onChange={handleSampleCostingChange}
                  >
                    <option value="" selected disabled hidden>
                      Select Type
                    </option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="NA">NA</option>
                  </select>
                </div>
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
                onChange={handleSampleCostingChange}
                value={sampleCostingData.totalQty}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
             Extra
              </label>
              <input
                type="number"
                name="extraQty"
                className={styles.basicInput}
                placeholder="extraQty"
                onChange={handleSampleCostingChange}
                value={sampleCostingData.extraQty}
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
                  activePage === "overHead" ? styles.active : ""
                }`}
                onClick={() => setActivePage("overHead")}
              >
                Over Head
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
                  activePage === "specification" ? styles.active : ""
                }`}
                onClick={() => setActivePage("specification")}
              >
                Specification
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
                  sampleCostingData={sampleCostingData}
                  setSampleCostingData={setSampleCostingData}
                  editDetails={editDetails}
                  setEditDetails={setEditDetails}
                  resetTrigger={resetTrigger}
                  onResetDone={() => setResetTrigger(false)}
                />
              </div>
            </div>
          )}

          {activePage === "overHead" && (
            <div>
              <div className={styles.materialTableContainer}>
                <OverHead
                 sampleCostingData={sampleCostingData}
                 setSampleCostingData={setSampleCostingData}
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
                 sampleCostingData={sampleCostingData}
                 setSampleCostingData={setSampleCostingData}
                 editDetails={editDetails}
                 setEditDetails={setEditDetails}
                 resetTrigger={resetTrigger}
                 onResetDone={() => setResetTrigger(false)} />
              </div>
            </div>
          )}

          {activePage === "size" && (
            <div>
              <div className={styles.materialTableContainer}>
                <SizeRoles sampleCostingData={sampleCostingData}
                 setSampleCostingData={setSampleCostingData}
                 editDetails={editDetails}
                 setEditDetails={setEditDetails}
                 resetTrigger={resetTrigger}
                 onResetDone={() => setResetTrigger(false)}
                 />
              </div>
            </div>
          )}

          {activePage === "specification" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Specifications  sampleCostingData={sampleCostingData}
                 setSampleCostingData={setSampleCostingData}
                 editDetails={editDetails}
                 setEditDetails={setEditDetails}
                 resetTrigger={resetTrigger}
                 onResetDone={() => setResetTrigger(false)}/>
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
                    onClick={handleUpdateSampleCostingClick}
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
                      disabled={sampleCostingData.groups && !sampleCostingData.groups.length > 0}
                      onClick={handleSubmitSampleCostingClick}
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
          {/* <ViewSampleCosting onBOMSelect={handleBOMEdit} /> */}
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

export default SampleCosting;
