import React, { useEffect, useState } from "react";
import styles from "../styles/itemDirectory.module.css";
import Cross from "../assets/cross.svg";
import { postApiService } from "../service/apiService";

const ItemHeadPopup = ({ onCancel, itemForm }) => {
  const [isheadDropDown, setIsHeadDropdown] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemHeadForm, setItemHeadForm] = useState({
    head: "",
    value: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = "item/createItemHead";
    try {
      const response = await postApiService(itemHeadForm, BASE_URL);
      setResponseMessage(response.message);
    } catch (error) {
      if (error.response) {
        setResponseMessage(
          error.response.data.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        setResponseMessage("No response received from the server.");
      } else {
        setResponseMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.itemHeadPopupContainer}>
        <div className={styles.topBarContainer}>
          <h1>Add Value Here</h1>
          <img
            onClick={() => {
              onCancel();
            }}
            src={Cross}
            alt="Select Icon"
            className={styles.crossIcon}
          />
        </div>
        <div className={styles.bottomBarContainer}>
          <div className={styles.itemsDiv}>
            <label className={styles.sampleLabel2} htmlFor="head">
              Head
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Click Dropdown"
                value={itemHeadForm.head}
                onChange={(e) =>
                  setItemHeadForm({ ...itemHeadForm, head: e.target.value })
                }
              />
              <button
                onClick={() => setIsHeadDropdown(!isheadDropDown)}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {isheadDropDown && (
                <div className={styles.suggestions}>
                  {Object.keys(itemForm).map((key, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setItemHeadForm({
                          ...itemHeadForm,
                          head: key,
                        });
                        setIsHeadDropdown(false);
                      }}
                    >
                      {key}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.itemsDiv}>
            <label className={styles.sampleLabel2} htmlFor="value">
              Value
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Value"
              value={itemHeadForm.value}
              onChange={(e) =>
                setItemHeadForm({ ...itemHeadForm, value: e.target.value })
              }
            />
          </div>

          <div className={styles.bottomItemButtonContainer}>
            <h3>{responseMessage}</h3>
            {loading ? (
              <div className={styles.loader2}></div>
            ) : (
              <button
                disabled={!itemHeadForm.head || !itemHeadForm.value}
                className={styles.ItemSelectPopupButton}
                onClick={handleSubmit}
              >
                Add Value
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemHeadPopup;
