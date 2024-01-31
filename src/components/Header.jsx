import React, { useState } from "react";
import styles from "../styles/header.module.css";
import inputStyles from "../styles/inputDetails.module.css";
import buttonstyles from "../styles/button.module.css";
import Logo from "../assets/logo.png";
import UserIcon from "../assets/user.svg";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../assets/logout.svg";
import HamburgerIcon from "../assets/hamburger.svg";
import useIsSmallScreen from "../features/useIsSmallScreen";

const Header = ({ toggleSidebar }) => {
  const isSmallScreen = useIsSmallScreen();
  const [isCore, setIsCore] = useState(true);

  const navigate = useNavigate();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.topHeader}>
        <div className={styles.leftDiv}>
          {isSmallScreen ? (
            <div className={styles.inlinelogo}>
              <img
                className={styles.menuIcons}
                src={HamburgerIcon}
                alt="Hamburger"
                onClick={toggleSidebar}
              />
            </div>
          ) : (
            <div>
              <img
                onClick={() => navigate("/")}
                className={styles.logoImg}
                src={Logo}
                alt="Company Logo"
              />
            </div>
          )}
        </div>

        <div className={styles.rightDiv}>
        <div className={styles.finYear}>
                {!isSmallScreen && <label
                  className={styles.impsampleLabel}
                  htmlFor="finYear"
                  required
                >
                   Financial Year
                </label>}
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    name="finYear"

                  >
                    <option value="" selected disabled hidden>
                     Year
                    </option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>
          {isCore ? (
            // <div
            //   className={styles.rightPinDiv}
            //   onClick={() => setIsCore(!isCore)}
            // >
            //   <span className={styles.userSpanTop}>Core</span>

            // </div>
            <button
              className={buttonstyles.buttonpushable}
              onClick={() => setIsCore(!isCore)}
            >
              <span className={buttonstyles.buttonshadow}></span>
              <span className={buttonstyles.buttonedge}></span>
              <span
                className={`${buttonstyles.buttonfront} ${buttonstyles.text}`}
                style={{ background: "#FF5722" }}
              >
                Core
              </span>
            </button>
          ) : (
            // <div
            //   className={styles.rightPinDiv2}
            //   onClick={() => setIsCore(!isCore)}
            // >
            //   <span className={styles.userSpanTop}>Analytics</span>

            // </div>
            <button
              className={buttonstyles.buttonpushable}
              onClick={() => setIsCore(!isCore)}
            >
              <span className={buttonstyles.buttonshadow}></span>
              <span className={buttonstyles.buttonedge}></span>
              <span
                className={`${buttonstyles.buttonfront} ${buttonstyles.text}`}
              >
                Analytics
              </span>
            </button>
          )}

          <div className={styles.rightUserDiv}>
            <img
              className={styles.navRightImage}
              src={UserIcon}
              alt="UserIcon"
            />
            <p className={styles.UserInfo}>
              <span className={styles.userSpanOne}>
                Kevin Singh
              </span>
        
            </p>
          </div>

          <div className={styles.rightLogoutDiv}>
            <img
              className={styles.navRightImage}
              src={LogoutIcon}
              onClick={() => navigate("/login")}
              alt="LogoutIcon"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
