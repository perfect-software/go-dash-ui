import React, { useState } from "react";
import styles from "../styles/supplier.module.css";
import SupplierProvidedDetails from "./SupplierProvidedDetails";

const Supplier = () => {
  const [activeButton, setActiveButton] = useState("details");

  return (
    <div className={styles.supplierContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Supplier Directory</h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Supplier Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "providedDetails" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("providedDetails")}
            >
              Supplier Provided Details
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (

        <>   <div className={styles.topContainer}>
        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Party Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Name"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Abbrevation
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>
        

          <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="Country">
                Country
              </label>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput} name="Country">
                  <option value="" selected disabled hidden>
                    Select Country
                  </option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Agra">Agra</option>
                  <option value="Kanpur">Kanpur</option>
                </select>
              </div>
            </div>
            <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="currency">
              Currency
              </label>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput} name="currency">
                  <option value="" selected disabled hidden>
                    Select Currency
                  </option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Agra">Agra</option>
                  <option value="Kanpur">Kanpur</option>
                </select>
              </div>
            </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Mobile Number
            </label>
            <input
              type="number"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>
    
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Phone No.
            </label>
            <input
              type="number"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Email Id
            </label>
            <input
              type="email"
              className={styles.basicInput}
              placeholder="Enter here "
            />
          </div>

          <div className={styles.colSpan}>
              <label className={styles.sampleLabel} htmlFor="city">
                Currency
              </label>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput} name="currency">
                  <option value="" selected disabled hidden>
                    Select currency
                  </option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Agra">Agra</option>
                  <option value="Kanpur">Kanpur</option>
                </select>
              </div>
            </div>
        </div>{" "}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.resetButton}>Reset</button>
        <button className={styles.submitButton}>
          Submit
        </button>
      </div>
      </>
     
        
      ) : (
        <SupplierProvidedDetails />
      )}
    </div>
  );
};

export default Supplier;
