import React, { useState } from "react";
import styles from "../styles/supplier.module.css";

const Supplier = () => {
  const [activeButton, setActiveButton] = useState('details');

  return (
    <div className={styles.supplierContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Supplier Directory</h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${activeButton === "details" ? styles.active : ""}`}
              onClick={() => setActiveButton("details")}
            >
              Supplier Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${activeButton === "providedDetails" ? styles.active : ""}`}
              onClick={() => setActiveButton("providedDetails")}
            >
              Supplier Provided Details
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>
  

       {activeButton === "details" ? (<div>1</div>):(<div>2</div>)}


    </div>
  );
};

export default Supplier;
