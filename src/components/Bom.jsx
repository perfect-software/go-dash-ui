import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import tableStyles from "../styles/bom.module.css";
import { getApiService, getDataApiService, postApiService } from "../service/apiService";
import { generatePDF } from "../features/generateBomPDF";
import InventoryCheckPopup from "../popups/InventoryCheckPopup";
import OverHead from "./bomPages/OverHead";
import Downshift from "downshift";
import GraphAverage from "./bomPages/GraphAverage";
import Comments from "./bomPages/Comment";
import SizeRoles from "./bomPages/SizeRole";
import Specifications from "./bomPages/Specification";
const Bom = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [srList ,setSrList]=useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [filteredsrList ,setfilteredSrList]=useState([]);
  const [activeButton, setActiveButton] = useState("details");
  const [isInventoryPopup, setIsInventoryPopup] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const [bomData, setBomData] = useState({
    sampleNo: "",
    articleNo: "",
    buyerName: "",
    totalCost:"",
    groups: [],
  });

  const [showInputLoading, setShowInputLoading] = useState({
    sampleNo: false,
  
  });

  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };

  const [showSuggestions, setShowSuggestions] = useState({
    sampleNo: false,
  });
  const [activePage, setActivePage] = useState('graphAverage');
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
  };

  const handleSampleNoChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setBomData({...bomData ,sampleNo:value})
    toggleSuggestVisibility(name, value.length > 0);
    const filteredItems = srList
      .filter((item) =>
        item.toLowerCase().includes(value.toLowerCase()))
      
    setfilteredSrList(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
  };


  const sampleRef = useRef(null);
  const downshiftsampleRef = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          toggleSuggestVisibility("sampleNo", false);
          setBomData({...bomData,sampleNo:selectedItem})
          fetchBySrNo(selectedItem);
        }
      }}
      selectedItem={bomData.sampleNo}
      itemToString={(item) => (item ? item : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleNoChange,
              name: "sampleNo",
            })}
            type="text"
            ref={sampleRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={bomData.sampleNo}
         
          />

          {showInputLoading.sampleNo ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("sampleNo");
                sampleRef.current?.focus();
              }}
              className={tableStyles.searchBtn}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions.sampleNo && (
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

 useEffect(()=>{
   fetchSRNo();
 },[])


  const fetchSRNo = async ()=>{
   const BASE_URL = 'bom/getSrNoList'
    const response = await getApiService(BASE_URL);
    setSrList(response);
  }

  const handleBomChange = (e) => {
    const { name, value } = e.target;
    setBomData({
      ...bomData,
      [name]: value,
    });
  };
 
  const fetchBySrNo = async (SRNo) => {
    toggleInputLoaderVisibility('sampleNo', true);
    try {
      const BASE_URL = 'bom/getSamplebySrNo';
      const response = await getDataApiService({ srno: SRNo }, BASE_URL); 
      setBomData({ ...bomData, buyerName: response.buyerName, articleNo: response.articleNo , sampleNo:SRNo });
    } catch (error) {
      console.error(error);
      togglePopup('Failed To Fetch');
    } finally {
      toggleInputLoaderVisibility('sampleNo', false);
    }
  };
  
  const resetAllFields = () => {
    setBomData({
      sampleNo: "",
      articleNo: "",
      buyerName: "",
    });
    setResetTrigger(true);
  };

  const handleViewPDF = async () => {
    const jsonData = JSON.stringify(bomData);
    console.log(jsonData);
    await generatePDF(bomData);
    
  };
  

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

 
  const prepareDataForSubmission = (bomData) => {

    const transformedData = {
      ...bomData,
      groups: bomData.groups.map((group) => ({
        itemgrp: group.id,
        subgroups: group.subgroups.map((subgroup) => ({
          itemsubgrp: subgroup.id,
          items: subgroup.items.map(item => ({
            itemId: item.itemId,
            usedIn: item.usedIn,
            pair: item.pair,
            supplierId: item.supplierId,
            stockConsumedQty: item.stockConsumedQty,
            bomQty: item.bomQty,
            unit: item.unit,
            requiredQty: item.requiredQty,
            rate: item.rate,
          }))
        }))
      }))
    };
  
    return transformedData;
  };

  const handleSubmitBomClick = async (e)=>{
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = await prepareDataForSubmission(bomData);
    const BASE_URL = 'bom/create';
    try {
       const responseData = await postApiService(dataToSubmit,BASE_URL);
       togglePopup(responseData.responseStatus.description);
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
  }


  return (
    <div className={styles.BOMContainer}>
        <div className={styles.headContainer}>
        <div className={styles.BOMSubHeadContainer}>
          <h1 className={styles.headText}>
           SR BOM
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
                <button
                  className={styles.headButton}
                  onClick={handleViewPDF}
                >
                  Print
                </button>
                  <button
                    className={styles.headButtonPrint}
                    onClick={() => {
                      setIsInventoryPopup(true);
                    }}
                  >
                    Inventory
                  </button>
           
          </div>
          </div>
        
        </div>
       
      </div>
      <div className={styles.headBorder}></div>
        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleName">
              Sample No
            </label>
            {downshiftsampleRef}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Article No
            </label>
            <input
              type="text"
              name="articleNo"
              className={styles.basicInput}
              placeholder="Article No"
              onChange={handleBomChange}
              value={bomData.articleNo}
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Buyer Name
            </label>
            <input
              type="text"
              name="buyerName"
              className={styles.basicInput}
              placeholder="Buyer Name"
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
        className={`${styles.screenChangeButton} ${activePage === "graphAverage" ? styles.active : ""}`}
        onClick={() => setActivePage("graphAverage")}
      >
       Graph Average
      </button>
      <button
        className={`${styles.screenChangeButton} ${activePage === "overHead" ? styles.active : ""}`}
        onClick={() => setActivePage("overHead")}
      >
       Over Head
      </button>
      <button
        className={`${styles.screenChangeButton} ${activePage === "comment" ? styles.active : ""}`}
        onClick={() => setActivePage("comment")}
      >
        Comment
      </button>
      <button
        className={`${styles.screenChangeButton} ${activePage === "specification" ? styles.active : ""}`}
        onClick={() => setActivePage("specification")}
      >
       Specification
      </button>
      <button
        className={`${styles.screenChangeButton} ${activePage === "size" ? styles.active : ""}`}
        onClick={() => setActivePage("size")}
      >
       Size Roll
      </button>
    </div>
        </div>
        <div className={styles.headBorder}></div>
    {activePage=="graphAverage" && <div>  
          <div className={styles.materialTableContainer}>
          <GraphAverage bomData={bomData} setBomData={setBomData} resetTrigger={resetTrigger} onResetDone={() => setResetTrigger(false)}/>
        </div>
    </div>}

      {activePage==="overHead" && <div>  
          <div className={styles.materialTableContainer}>
          <OverHead/>
        </div>
    
     </div>}

      {activePage==="comment" && <div>  
          <div className={styles.materialTableContainer}>
          <Comments/>
        </div>
    
      </div>}

      {activePage==="size" && <div>  
          <div className={styles.materialTableContainer}>
          <SizeRoles/>
        </div>
    
    </div>}
      
      {activePage==="specification" && <div>  
          <div className={styles.materialTableContainer}>
          <Specifications/>
        </div>
    
   </div>}
   <div className={styles.parentButtonContainer}>
        {loading ? (
          <div className={styles.buttonContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <button className={styles.resetButton} onClick={resetAllFields}>Reset</button>
            <button
              className={styles.submitButton}
               onClick={handleSubmitBomClick}
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
