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
import OverHead from "./bomPages/OverHead";
import Downshift from "downshift";
import { useDispatch, useSelector } from "react-redux";
import GraphAverage from "./bomPages/GraphAverage";
import Comments from "./bomPages/Comment";
import { fetchAllBom } from "../reducer/bomSlice";
import SizeRoles from "./bomPages/SizeRole";
import Specifications from "./bomPages/Specification";
import ViewBom from "./ViewBom";
import { fetchAllItemRates } from "../reducer/itemRateSlice";
import { fetchItemGroupsAndSubGroups } from "../reducer/grpSubgrpSlice";
const Bom = () => {
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [srList, setSrList] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [filteredsrList, setfilteredSrList] = useState([]);
  const initialValidationState = {};
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditSelected, setIsEditSelected] = useState(false);
  const [isPrintSelected, setIsPrintSelected] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [bomDetails, setBomDetails] = useState([]);
  const [itemGridData, setItemGridData] = useState([]);
  const [editDetails, setEditDetails] = useState(null);
  const [tempBomDetails, setTempBomDetails] = useState(null);
  const [validation, setValidation] = useState(initialValidationState);
  const [activeButton, setActiveButton] = useState("details");
  const [isInventoryPopup, setIsInventoryPopup] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const [bomData, setBomData] = useState({
    sr_no: "",
    articleNo: "",
    bomType: "",
    buyerName: "",
    totalCost: "",
    graphAvg: [],
  });
  const dispatch = useDispatch();
  const [showInputLoading, setShowInputLoading] = useState({
    sr_no: false,
  });
  const { itemGroups, itemSubGroups, itemLoaded, itemLoading, error } = useSelector(
    (state) => state.data
  );


  const { itemRates, loadedRate, loadingRate, errorRate } = useSelector(
    (state) => state.itemRate
  );
  useEffect(() => {
    if (!itemLoaded && !itemLoading) {
      dispatch(fetchItemGroupsAndSubGroups());
    }

  }, [itemLoaded, itemLoading, dispatch]);

  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);
  
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = ["sr_no", "articleNo", "buyerName"];

    requiredFields.forEach((field) => {
      if (!bomData[field] || bomData[field].trim() === "") {
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
    sr_no: false,
  });
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
    setBomData({ ...bomData, sr_no: value });
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
          setBomData({ ...bomData, sr_no: selectedItem });
          fetchBySrNo(selectedItem);
        }
      }}
      selectedItem={bomData.sr_no}
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
            value={bomData.sr_no}
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
    const BASE_URL = "bom/getSrNoList";
    const response = await getApiService(BASE_URL);
    setSrList(response);
  };
  const fetchBomDetails = async (bomId) => {
    try {
      if (bomId) {
        const BASE_URL = "bom/viewbomdetails";
        const response = await getDataApiService({ bomId: bomId }, BASE_URL);
        return response;
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
    }
  };

  const handleBOMEdit = (bom) => {
    setIsEditSelected(false);
    if (bom) {
      setIsEditSelected(true);
      setIsPrintSelected(true);
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
    setBomData({
      ...bomData,
      [name]: value,
    });
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const fetchBySrNo = async (SRNo) => {
    toggleInputLoaderVisibility("sr_no", true);
    try {
      const BASE_URL = "bom/getSamplebySrNo";
      const response = await getDataApiService({ srno: SRNo }, BASE_URL);
      setBomData({
        ...bomData,
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
    setBomData({
      sr_no: "",
      articleNo: "",
      buyerName: "",
      bomType: "",
    });
    setValidation(initialValidationState);
    setResetTrigger(true);
  };

  const handleViewPDF = async () => {
    setPrintLoading(true);
    await fetchBySrNo(tempBomDetails[0].srno);
    try {
      const response = await fetchBomDetails(tempBomDetails[0].bomId);
      if (response) {
        await handleUpdateMaterial(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setPrintLoading(false);
      setIsPrintSelected(false);
    }
  };

  const handleUpdateMaterial = async (response) => {
    setBomData((prevData) => {
      let newData = JSON.parse(JSON.stringify(prevData));
      response.forEach((editItem) => {
        let group = newData.groups.find((g) => g.id === editItem.itemGrp);
        if (!group) {
          const groupName = itemGroups[editItem.itemGrp];
        
          group = {
            id: editItem.itemGrp,
            name: groupName, 
            subgroups: [],
          };
          newData.groups.push(group);
        }
  
        let subgroup = group.subgroups.find((sg) => sg.id === editItem.itemSubGrp);
        if (!subgroup) {
          const subgroupName = itemSubGroups[editItem.itemSubGrp];
          subgroup = {
            id: editItem.itemSubGrp,
            name: subgroupName.name,
            items: [],
          };
          group.subgroups.push(subgroup);
        }
        const itemDetails = itemRates.find(item => item.itemId === editItem.item_id);
        const tempItemName = itemDetails ? itemDetails.itemName : null;
        let itemIndex = subgroup.items.findIndex(i => i.itemId === editItem.item_id);
      if (itemIndex !== -1) {
        subgroup.items[itemIndex] = {
          ...subgroup.items[itemIndex],
          itemName: tempItemName || 'Unknown',
          usedIn: editItem.usedIn,
          pair: editItem.pair,
          bomQty: editItem.bomQty,
          supplierId: editItem.supplier_id,
          unit: editItem.unit,
          requiredQty: editItem.reqQty,
          rate: editItem.rate,
          cost: editItem.rate * editItem.reqQty,
        }
        } else {
          subgroup.items.push({
            itemId: editItem.item_id,
            itemName: tempItemName || 'Unknown',
            usedIn: editItem.usedIn,
            pair: editItem.pair,
            bomQty: editItem.bomQty,
            supplierId: editItem.supplier_id,
            supplierName: editItem.supplierName,
            unit: editItem.unit,
            requiredQty: editItem.reqQty,
            rate: editItem.rate,
            cost: editItem.rate * editItem.reqQty,
          });
        }
      });

    generatePDF(newData);
    return newData;
  });
  setBomData([]);
  };
  

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const prepareDataForSubmission = (bomData) => {
    console.log(itemGridData);
  
    const updatedBomData = {
      ...bomData, // Spread the existing bomData to keep other properties intact
      graphAvg: itemGridData.map((item) => ({
        itemId: item.itemId.id,            // Extract only the id from itemId
        usedIn: item.usedIn,
        pair: item.pair,
        supplierId: item.supplierId.id,    // Extract only the id from supplierId
        stockConsumedQty: item.stockConsumedQty,
        bomQty: item.bomQty,
        unit: item.unit,
        requiredQty: item.requiredQty,
        rate: item.rate,
        itemgrp: item.itemgrp.id,          // Extract only the id from itemgrp
        itemsubgrp: item.itemsubgrp.id,    // Extract only the id from itemsubgrp
      })),
    };
  
    return updatedBomData;
  };
  
  

  const handleUpdateBomClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const dataToSubmit = await prepareDataForSubmission(bomData);
    console.log('data',dataToSubmit);
    
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
    const dataToSubmit = await prepareDataForSubmission(bomData);
    console.log('data',dataToSubmit);
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
                ? `Update SR BOM: ${
                    isEditClicked &&
                    tempBomDetails[0].bomId &&
                    tempBomDetails[0].bomId
                  }`
                : "SR BOM"
              : "SR BOM Search"}
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
                Sample No
              </label>
              {downshiftsampleRef}
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
                onChange={handleBomChange}
                value={bomData.articleNo}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                Buyer Name
              </label>
              <input
                type="text"
                name="buyerName"
                className={styles.basicInput}
                placeholder="Buyer Name"
                style={
                  validation.buyerName === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleBomChange}
                value={bomData.buyerName}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="articleNo">
                Bom Type
              </label>
              <input
                type="text"
                name="bomType"
                className={styles.basicInput}
                placeholder="BOM Type"
                onChange={handleBomChange}
                value={bomData.bomType}
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
                  bomData={bomData}
                  itemGridData={itemGridData}
                  setItemGridData={setItemGridData}
                  setBomData={setBomData}
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
                <OverHead />
              </div>
            </div>
          )}

          {activePage === "comment" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Comments />
              </div>
            </div>
          )}

          {activePage === "size" && (
            <div>
              <div className={styles.materialTableContainer}>
                <SizeRoles />
              </div>
            </div>
          )}

          {activePage === "specification" && (
            <div>
              <div className={styles.materialTableContainer}>
                <Specifications />
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
                    //  disabled={bomData.groups && !bomData.groups.length > 0}
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
          <ViewBom onBOMSelect={handleBOMEdit} handleEditClick={handleEditClick} handleViewPDF={handleViewPDF} />
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
    </div>
  );
};

export default Bom;
