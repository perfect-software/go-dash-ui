import React, { useState } from "react";
import styles from "../styles/itemDirectory.module.css";
import { getCurrentYearLastTwoDigits } from "../features/convertDate";

const ItemDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  return (
    <div className={styles.itemPageContainer}>
      <div className={styles.itemDirectoryContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Item Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <h2>Create Item</h2>
            <div className={styles.headBorder}></div>
          </div>
        </div>

        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="animal">
              Animal
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput}>
                <option value="" selected disabled hidden>
                  Select Animal
                </option>
                <option value="Snake">Snake</option>
                <option value="Sheep">Sheep</option>
              </select>
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="season">
              Season
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput}>
                <option value="" selected disabled hidden>
                  Select Season
                </option>
                <option value={`SS${getCurrentYearLastTwoDigits()}`}>
                  SS{getCurrentYearLastTwoDigits()}
                </option>
                <option value={`SW${getCurrentYearLastTwoDigits()}`}>
                  SW{getCurrentYearLastTwoDigits()}
                </option>
                <option value={`SS${getCurrentYearLastTwoDigits()}`}>
                  SR{getCurrentYearLastTwoDigits()}
                </option>
                <option value={`SW${getCurrentYearLastTwoDigits()}`}>
                  SA{getCurrentYearLastTwoDigits()}
                </option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="characteristics">
                  Character -<br/>istics
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput}>
                    <option value="" selected disabled hidden>
                      Select Characteristics
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="substance">
            Substance
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tanning">
              Tanning
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} >
                <option value="" selected disabled hidden>
                  Select Tanning
                </option>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="origin">
              Origin
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} >
                <option value="" selected disabled hidden>
                  Select Origin
                </option>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tannery">
             Tannery
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="color">
              Color
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} >
                <option value="" selected disabled hidden>
                  Select Color
                </option>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="uniqueCode">
              Unique Code
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinType">
             Skin Type
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} >
                <option value="" selected disabled hidden>
                  Select Skin
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinSize">
             Skin Size
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} >
                <option value="" selected disabled hidden>
                  Select Size
                </option>
                <option value="11">11</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

        
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="itemName">
              Item Name (Own)
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="supplierItemName">
             Supplier Item Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.resetButton}>Reset</button>
          <button onClick={togglePopup} className={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>New Item Added</h2>
            <button className={styles.popupButton} onClick={togglePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDirectory;
