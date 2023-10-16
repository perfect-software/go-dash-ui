import React, { useEffect, useState } from "react";
import styles from "../styles/buyer.module.css";
import UpIcon from "../assets/up.svg";
import ArticlePopup from "../popups/ArticlePopup";
import { useNavigate } from "react-router-dom";
import BuyerPopup from "../popups/BuyerPopup";
import SampleDirPopup from "../popups/SampleDirPopup";

const Buyer = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [isSampleDirPopup, setIsSampleDirPopup] = useState(false);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const [isGridVisible, setIsGridVisible] = useState({
    basic: true,
    internal: true,
    delivery: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };
  const today = new Date();

  const formattedDate = today.toISOString().split("T")[0];
  
  return (
    <div className={styles.sampleRequestMainContainer}>
      <div className={styles.headContiner}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Buyer Directory</h1>
        
        </div>

        <div className={styles.subHeadContainerTwo}>
          {/* <h2>Sample Order Details</h2> */}
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Buyer Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("view")}
            >
             View all buyers
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Buyer Name
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                Abbreviation
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter here "
                 
                />
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="country">
                  Country
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="country">
                    <option value="" selected disabled hidden>
                      Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="Italy">Italy</option>
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="city">
                  Type of Sample
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="city">
                    <option value="" selected disabled hidden>
                      Select Type
                    </option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="Type 3">Type 3</option>
                    <option value="Type 4">Type 4</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Buyer
                </label>

                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Click on Search"
                    className={styles.basicInput2}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      setIsBuyerPopup(true);
                    }}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Sample Ref.
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Click on Search"
                    className={styles.basicInput2}
                    readOnly
                  />
                  <button
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>
             
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerTop}
              onClick={() => toggleGridVisibility("basic")}
            >
              <span>Basic Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.basic ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              className={`${styles.middleGrid} ${
                isGridVisible.basic ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Buyer Ref.
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input3">
                  Buyer Article No.
                </label>
                <input
                  type="text"
                  id="input3"
                  className={styles.basicInput}
                  placeholder="Input 3"
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input2">
                  Article Id and Name
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Click on Search"
                    className={styles.basicInput2}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      setIsArticlePopup(true);
                    }}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Size
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="size">
                    <option value="" selected disabled hidden>
                      Select Size
                    </option>
                    <option value="11">11</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Quantity
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="quantity">
                    <option value="" selected disabled hidden>
                      Select Quantity
                    </option>
                    <option value="5">5</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Pair
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="pair">
                    <option value="" selected disabled hidden>
                      Select Pair
                    </option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Colour
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="Colour">
                    <option value="" selected disabled hidden>
                      Select Color
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Upper Colour
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="upperColour">
                    <option value="" selected disabled hidden>
                      Select Color
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Lining Colour
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="liningColour">
                    <option value="" selected disabled hidden>
                      Select Color
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Last
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="Last">
                    <option value="" selected disabled hidden>
                      Select Color
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Insole
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.basicInput} name="Insole">
                    <option value="" selected disabled hidden>
                      Select Insole
                    </option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Sole Label & Colour
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Heel
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyer">
                  Pattern
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                />
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerBottom}
              onClick={() => toggleGridVisibility("internal")}
            >
              <span>Internal Info Own</span>
              <img
                src={UpIcon} // Replace with the actual path to your icon
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.internal ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.secondMiddleGrid} ${
                isGridVisible.internal ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Upper Leather
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Lining
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Qunatity
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
            </div>
          </div>
          <div className={styles.headSmallBorder}></div>

          <div className={styles.bottomContainer}>
            <div
              className={styles.insideBottomContainer}
              onClick={() => toggleGridVisibility("delivery")}
            >
              <span>Delivey Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.delivery ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.bottomGrid} ${
                isGridVisible.delivery ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Delivery Date
                </label>
                <input type="date" className={styles.basicInput} />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Prod-Ex Date
                </label>
                <input type="date" className={styles.basicInput} />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Delivery Address
                </label>
                <input type="text" className={styles.basicInput} />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Comment (Leather)
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Comment (Sole)
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                />
              </div>
              <div className={styles.buttonColSpan}>
                <div className={styles.buttonContainer2}>
                  <button className={styles.resetButton}>Reset</button>
                  <button onClick={togglePopup} className={styles.submitButton}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
            {isGridVisible.delivery ? (
              ""
            ) : (
              <div className={styles.buttonContainer}>
                <button className={styles.resetButton}>Reset</button>
                <button onClick={togglePopup} className={styles.submitButton}>
                  Submit
                </button>
              </div>
            )}
          </div>
          {isPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <h2>
                  Sample Request <br /> Successfully Submitted
                </h2>
                <button className={styles.popupButton} onClick={togglePopup}>
                  OK
                </button>
              </div>
            </div>
          )}
          {isImagePopup && (
            <div className={styles.popupOverlay}>
              <div
                className={styles.imagePopupContent}
                style={{ backgroundImage: `url(${imagePreview})` }}
              >
                <button
                  className={styles.popupButton}
                  style={{ marginBottom: "3px" }}
                  onClick={() => setIsImagePopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {isArticlePopup && (
            <ArticlePopup
              onCancel={() => {
                setIsArticlePopup(false);
              }}
            />
          )}
          {isBuyerPopup && (
            <BuyerPopup
              onCancel={() => {
                setIsBuyerPopup(false);
              }}
            />
          )}
          {isSampleDirPopup && (
            <SampleDirPopup
              onCancel={() => {
                setIsSampleDirPopup(false);
              }}
            />
          )}
        </>
      ) : (
        <div>View Sr</div>
      )}
    </div>
  );
};

export default Buyer;
