import React from "react";
import styles from "../styles/home.module.css";
import Arrow from '../assets/arrowNav.svg';
const Home = () => {
  return (
  
      <div className={styles.homeParentContainer}>
        <div>
          <h1>Welcome Kewin!</h1>
          <h2>Quick Links</h2>
        </div>

        <div className={styles.topButtonContainer}>
          <button className={styles.navButton}>
            <span className={styles.span}>Create Sample</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>

          <button className={styles.navButton}>
            <span className={styles.span}>New Buyer Order</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>

          <button className={styles.navButton}>
            <span className={styles.span}>Add New Article</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>
        </div>

        <div className={styles.topTwoButtonContainer}>
          <button className={styles.navButton}>
            <span className={styles.span}>Add New Item</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>
        </div>


         <div className={styles.border}></div>
          
         <h3>Frequest Reports</h3>
 
         <div className={styles.bottomButtonContainer}>
          
          <button className={styles.navButton}>
            <span className={styles.span}>Sample Report</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>

          <button className={styles.navButton}>
            <span className={styles.span}>Sales Report</span>
            <img src={Arrow} alt="Icon" className={styles.buttonIcon} />
          </button>
        </div>

      </div>
   
  );
};

export default Home;
