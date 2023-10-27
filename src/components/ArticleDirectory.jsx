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
              Article Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Article Color
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="ArticleColor" required>
                    <option value="" selected disabled hidden>
                      Select Color
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
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
                <label className={styles.sampleLabel} htmlFor="input4">
                  Gender
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="gender" required>
                    <option value="" selected disabled hidden>
                      Select Gender
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>

         

        
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Sole Type
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="SoleType" required>
                    <option value="" selected disabled hidden>
                      Select Sole
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Toe Shape
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="toeshape" required>
                    <option value="" selected disabled hidden>
                      Select Toe
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
             Shoe Type
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Category
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="category" required>
                    <option value="" selected disabled hidden>
                     Select Category
                    </option>
                    <option value="Boot">Boot</option>
                    <option value="Snekers">Snekers</option>
                  </select>
                </div>
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
                <label className={styles.sampleLabel} htmlFor="input4">
                  Heel Type
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="heelType" required>
                    <option value="" selected disabled hidden>
                      Select Heel
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
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

          <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Last No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="last" required>
                    <option value="" selected disabled hidden>
                      Select No.
                    </option>
                    <option value="221">221</option>
                    <option value="223">223</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Lining Material
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
              Heel No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
             Referance
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
         
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
            Socks Material
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
