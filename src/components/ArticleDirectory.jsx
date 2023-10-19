import React, { useState } from "react";
import styles from "../styles/articleDirectory.module.css";

const ArticleDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  return (
    <div className={styles.articlePageContainer}>
      <div className={styles.articleDirectoryContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Article Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <h2>Article Details</h2>
            <div className={styles.headBorder}></div>
          </div>
        </div>

        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Article No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Article Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Category
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Type
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Toe Shape
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Animal
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Sole Type
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Gender
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Heel Type
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Heel Height
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.largeColSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Comment
            </label>
            <textarea
              className={styles.basicInput2}
              placeholder="Enter Here"
              rows="3" 
            ></textarea>
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
            <h2>New Article Added</h2>
            <button className={styles.popupButton} onClick={togglePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDirectory;
