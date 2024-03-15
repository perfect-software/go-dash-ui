
import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import tableStyles from "../styles/bom.module.css";
import {
  getApiService,
  getDataApiService,
  postApiService,
  putApiService,
} from "../service/apiService";
import Currencydata from "currency-codes/data";
import { generatePDF } from "../features/generateBomPDF";
import InventoryCheckPopup from "../popups/InventoryCheckPopup";
import Downshift from "downshift";
import { useDispatch, useSelector } from "react-redux";
import GraphAverage from "./productionPurchaseOrderPages/GraphAverage";
import { fetchAllBom } from "../reducer/bomSlice";
import Size from "./productionPurchaseOrderPages/Size";
import ViewPurchaseOrder from "./viewPurchaseOrder";
import { fetchAllItemHeads } from "../reducer/itemHeadSlice";
import Remarks from "./productionPurchaseOrderPages/Remarks";
import WorkOrder from "./productionPurchaseOrderPages/WorkOrder";
import BuyerPopup from "../popups/BuyerPopup";
import ViewProductionPurchaseOrder from "./ViewProductionPurchaseOrder";

const ProductionPurchaseOrder = () => {
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
  const [bomDetails, setBomDetails] = useState([]);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [tempBomDetails, setTempBomDetails] = useState(null);
  const [validation, setValidation] = useState(initialValidationState);
  const [activeButton, setActiveButton] = useState("details");
  const [isInventoryPopup, setIsInventoryPopup] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [bsId ,setBsId]= useState('');
  const [poDetails, setPODetails] = useState(null);
  const [sizeDetails, setSizeDetails] = useState(null);
  const [showOrder,setShowOrder] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    po_no: "",
    buyer: "",
    currency:"",
    poType:"",
    type:"",
    season:"",
    buyerName: "",
  });
  const [tempList, setTempList] = useState({
    currencyList: [],
    seasonList:[],
    poTypeList:[],
  });
  const dispatch = useDispatch();
  const [showInputLoading, setShowInputLoading] = useState({
    po_no: false,
    season:false,
    poType:false,
    buyer:false,
    currency:false,
  });
  const { itemHeads, itemLoaded, itemLoading, error } = useSelector(
    (state) => state.itemHead
  );

  useEffect(() => {
    if (!itemLoaded && !itemLoading) {
      dispatch(fetchAllItemHeads());
    }
  }, [itemLoaded, itemLoading, dispatch]);


  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = ["po_no","buyer","currency","season","buyerName","poType"];

    requiredFields.forEach((field) => {
      if (!purchaseData[field] || purchaseData[field].trim() === "") {
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

  const [showSuggestions, setShowSuggestions] = useState({
    po_no: false,
    buyer:false,
    poType:false,
    currency:false,
    season:false,
  });
  const [activePage, setActivePage] = useState("workOrder");
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
    setPurchaseData({ ...purchaseData, po_no: value });
    toggleSuggestVisibility(name, value.length > 0);
    const filteredItems = srList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredSrList(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
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

  const fetchByPO = async (poType) => {
    toggleInputLoaderVisibility("poType", true);
    try {
      const BASE_URL = "productionPurchaseOrder/getRemarkbyPoType";
      const response = await getDataApiService({ poType: poType }, BASE_URL);
      setPODetails(response)
      if (response) {
        setValidation((prev) => ({ ...prev, poType: "valid" }));
      }
    } catch (error) {
      console.error(error);
      togglePopup("Failed To Fetch");
    } finally {
      toggleInputLoaderVisibility("poType", false);
    }
  };
  const fetchBySize = async () => {
    try {
      const BASE_URL = "productionPurchaseOrder/getRemarkbyPoType";
      const response = await getDataApiService({ articleNO }, BASE_URL);
      setSizeDetails(response)
    } catch (error) {
      console.error(error);
      togglePopup("Failed To Fetch");
    } 
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setPurchaseData({ ...purchaseData, [name]: value });

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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleDropItemChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setPurchaseData({ ...purchaseData, [name]: value });
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
  const sampleRef = useRef(null);
  const downshiftsampleRef = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          toggleSuggestVisibility("po_no", false);
          setPurchaseData({ ...purchaseData, po_no: selectedItem });
          fetchBySrNo(selectedItem);
        }
      }}
      selectedItem={purchaseData.po_no}
      itemToString={(item) => (item ? item.po_no : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleNoChange,
              name: "po_no",
            })}
            type="text"
            ref={sampleRef}
            style={
              validation.po_no === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={purchaseData.po_no}
          />

          {showInputLoading.po_no ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("po_no");
                sampleRef.current?.focus();
              }}
              className={tableStyles.searchBtn}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions.po_no && (
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
  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        console.log(selectedItem);
        if (selectedItem) {
          setPurchaseData({
            ...purchaseData,
            buyer: selectedItem.bsName,
          });
          setBsId(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={purchaseData.buyer}
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
            disabled={isEditClicked}
            placeholder="Type 3 words"
            value={purchaseData.buyer}
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
          setPurchaseData({
            ...purchaseData,
            season: selectedItem.name,
          });
          toggleSuggestVisibility("season", false);
        }
      }}
      selectedItem={purchaseData.season}
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
            value={purchaseData.season}
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

  const poTypeInputRef = useRef(null);
  const downshiftPoType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setPurchaseData({
            ...purchaseData,
            poType: selectedItem.name,
          });
          fetchByPO(selectedItem.name);
          toggleSuggestVisibility("poType", false);
        }
      }}
      selectedItem={purchaseData.poType}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleDropItemChange,
              name: "poType",
            })}
            type="text"
            maxLength="20"
            ref={poTypeInputRef}
            className={styles.buttonBasicInput}
            placeholder="Insert First Letter"
            value={purchaseData.poType}
          />

          {showInputLoading.poType ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <div>
              {" "}
              <button
                onClick={() => {
                  handleDropItemClick("poType");
                  poTypeInputRef.current?.focus();
                }}
                className={styles.dropBtn}
                aria-label="dropDorn"
              ></button>{" "}
            </div>
          )}

          {showSuggestions.poType && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {tempList.poTypeList.map((item, index) => (
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
  const downshiftCurrency = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setPurchaseData({
            ...purchaseData,
            currency: selectedItem.code,
          });
          toggleSuggestVisibility("currency", false);
        }
      }}
      selectedItem={purchaseData.currency}
      itemToString={(item) => (item ? item.name : "")}
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
            value={purchaseData.currency}
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

  const handleBuyerSubmit = (selectedBuyers) => {
    if (Array.isArray(selectedBuyers) && selectedBuyers.length > 0) {
      const selectedBuyer = selectedBuyers[0];
      setBsId(selectedBuyer.bs_id);
      setPurchaseData({
        ...purchaseData,
        buyer: selectedBuyer.bsName,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
    setValidation((prev) => ({ ...prev, bsName: "valid" }));
  };


 
  const handleBOMSelect = (bom) => {
    console.log(bom);
    if(bom)
    {
      const bomArray = Array.isArray(bom) ? bom : [bom];
      setSelectedRowData(bomArray);
      //fetchBySize();
    }
  };






  useEffect(() => {
    fetchSRNo();
  }, []);

  const fetchSRNo = async () => {
    const BASE_URL = "bom/getSrNoList";
    const response = await getApiService(BASE_URL);
    setSrList(response);
  };
  const handleBuyerInputChange = async (e) => {
    const { name, value } = e.target;
    setPurchaseData({ ...purchaseData, buyer: value });
    if (value.length >= 3) {
      toggleInputLoaderVisibility("buyer", true);
      const BASE_URL = `sample/getBuyer?input=${encodeURIComponent(value)}`;
      try {
        const fetchedBuyers = await getApiService(BASE_URL);
        setBuyers(fetchedBuyers);
        console.log(fetchedBuyers);
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
  const handleBOMEdit = (bom) => {
    setIsEditSelected(false);
    if (bom) {
      setIsEditSelected(true);
      setTempBomDetails(bom);
    }
  };
  const handleEditClick = async () => {
    setIsEditClicked(true);
    setUpdateLoading(true);
    setActiveButton("details");
    await fetchBySrNo(tempBomDetails[0].srno);
    try {
      const response = await fetchBomDetails(tempBomDetails[0].bomId);
      if (response) {
        setEditDetails(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBomChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData({
      ...purchaseData,
      [name]: value,
    });
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const fetchBySrNo = async (SRNo) => {
    toggleInputLoaderVisibility("po_no", true);
    try {
      const BASE_URL = "bom/getSamplebySrNo";
      const response = await getDataApiService({ srno: SRNo }, BASE_URL);
      setPurchaseData({
        ...purchaseData,
        buyerName: response.buyerName,
        articleNo: response.articleNo,
        po_no: SRNo,
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
      toggleInputLoaderVisibility("po_no", false);
    }
  };

  const resetAllFields = () => {
    setPurchaseData({
      po_no: "",
      articleNo: "",
      buyerName: "",
      bomType: "",
    });
    setValidation(initialValidationState);
    setResetTrigger(true);
  };

  const handleViewPDF = async () => {
    const jsonData = JSON.stringify(purchaseData);
    console.log(jsonData);
    await generatePDF(purchaseData);
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const prepareDataForSubmission = (purchaseData) => {
    const transformedData = {
      ...purchaseData,

      groups: purchaseData.groups.map((group) => ({
        itemgrp: group.id,
        subgroups: group.subgroups.map((subgroup) => ({
          itemsubgrp: subgroup.id,
          items: subgroup.items.map((item) => ({
            itemId: item.itemId,
            usedIn: item.usedIn,
            pair: item.pair,
            supplierId: item.supplierId,
            stockConsumedQty: item.stockConsumedQty,
            bomQty: item.bomQty,
            unit: item.unit,
            requiredQty: item.requiredQty,
            rate: item.rate,
          })),
        })),
      })),
    };

    return transformedData;
  };

  const handleUpdateBomClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const dataToSubmit = await prepareDataForSubmission(purchaseData);
    const updatedForm = {
      ...dataToSubmit,
      bomId: tempBomDetails[0].bomId,
    };
    console.log(updatedForm);
    const BASE_URL = "bom/update";
    try {
      const responseData = await putApiService(updatedForm, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllBom());
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


  const handleSubmitBomClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const dataToSubmit = await prepareDataForSubmission(purchaseData);
    const BASE_URL = "bom/create";
    try {
      const responseData = await postApiService(dataToSubmit, BASE_URL);
      togglePopup(responseData.responseStatus.description);
      resetAllFields();
      dispatch(fetchAllBom());
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
                ? `Update PO:`
                : "Production Purchase Order"
              : "Purchase Order Search"}
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
                Production Purchase Details
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
                View Production Purchase Order
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
              {/* {activeButton === "details" && (
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
              )} */}
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
                PO No.
              </label>
              {downshiftsampleRef}
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                Po Date
              </label>
              <input
                type="date"
                name="articleNo"
                className={styles.basicInput}
                placeholder="Article No"
                style={
                  validation.articleNo === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleBomChange}
                value={purchaseData.articleNo}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                Delivery At
              </label>
              <input
                type="text"
                name="buyerName"
                className={styles.basicInput}
                placeholder="Enter Here"
                style={
                  validation.buyerName === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleBomChange}
                value={purchaseData.buyerName}
              />
            </div>
            <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="city">
                   Type
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={purchaseData.buyerType}
                    name="type"
                    style={
                      validation.type === "invalid" ? { border: "2px solid red" } : {}
                    }
                    onChange={handleBomChange}
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
              <label className={styles.impsampleLabel} htmlFor="season">
                 Po Type
                </label>
                {downshiftPoType}
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="buyer">
                  Buyer Name
                </label>
                {downshiftBuyer}

              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="season">
                  Season
                </label>
                {downshiftSeason}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="currency">
                  Currency
                </label>
                {downshiftCurrency}
              </div>
              <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                S.P Remark
              </label>
              <input
                type="text"
                name="spRemark"
                className={styles.basicInput}
                placeholder="Add Remark"
                style={
                  validation.spRemark === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleBomChange}
                value={purchaseData.spRemark}
              />
            </div>
          </div>
          <div className={styles.middleContainerBottom}>
            <div className={styles.topButtons}>
            <button
                className={`${styles.screenChangeButton} ${
                  activePage === "workOrder" ? styles.active : ""
                }`}
                onClick={() => setActivePage("workOrder")}
              >
                Work Order
              </button>
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
                  activePage === "remark" ? styles.active : ""
                }`}
                onClick={() => setActivePage("remark")}
              >
                Remark
              </button>
           
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "size" ? styles.active : ""
                }`}
                onClick={() => setActivePage("size")}
              >
                Size
              </button>
            </div>
          </div>
          <div className={styles.headBorder}></div>
          {activePage == "graphAverage" && (
            <div>
              <div className={styles.materialTableContainer}>
                <GraphAverage
                  purchaseData={purchaseData}
                  setPurchaseData={setPurchaseData}
                  editDetails={editDetails}
                  setEditDetails={setEditDetails}
                  resetTrigger={resetTrigger}
                  selectedData={selectedRowData}
                  onResetDone={() => setResetTrigger(false)}
                />
              </div>
            </div>
          )}

          {activePage === "workOrder" && (
            <div>
              <div className={styles.materialTableContainer}>
                <WorkOrder bsId={bsId} onBomSelect={handleBOMSelect}  />
              </div>
            </div>
          )}

          {activePage === "remark" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Remarks poDetails={poDetails} />
              </div>
            </div>
          )}

          {activePage === "size" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Size sizeDetails={sizeDetails} />
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
                    onClick={handleUpdateBomClick}
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
                      disabled={purchaseData.groups && !purchaseData.groups.length > 0}
                      onClick={handleSubmitBomClick}
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
          <ViewProductionPurchaseOrder />
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
          {isBuyerPopup && (
            <BuyerPopup
              onCancel={() => {
                setIsBuyerPopup(false);
              }}
              onSubmitBuyerData={handleBuyerSubmit}
            />
          )}
      {isInventoryPopup && (
        <InventoryCheckPopup
          onCancel={() => {
            setIsInventoryPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductionPurchaseOrder;
