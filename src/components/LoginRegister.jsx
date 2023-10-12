import React, { useState } from "react";
import styles from "../styles/login_register.module.css";
import { NavLink } from "react-router-dom";
import EyeClosedIcon from "../assets/closeEye.svg";
import EyeOpenIcon from "../assets/openEye.svg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const LoginRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setisLogin] = useState(true);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Check Your email");
      return;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.error("Must Have 10 Digits");
      return;
    } else if (!validatePassword(formData.password)) {
      toast.error("Check Your Password");
      return;
    }

    setSubmittedData((prevData) => [...prevData, formData]);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
    toast.success("Registered Successfully");
    console.log(formData);
    setisLogin(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = submittedData.find((user) => user.email === logEmail);

    if (!user) {
      toast.error("User not found!");
      return;
    }

    if (user.password !== logPassword) {
      toast.error("Invalid Credentials");
      return;
    }

    toast.success("Login successful!");
  };

  return (
    <div className={styles.mainLoginContainer}>
      <div>
        <Toaster />
      </div>
      <div className={styles.leftDiv}>
        {isLogin ? (
          <div className={styles.loginBoxContainer}>
            <h1>Shoe ERP+</h1>

            <div className={styles.loginFormContainer}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                required
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)}
              />
              <div className={styles.passwordContainer}>
                <input
                  className={styles.passInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={logPassword}
                  onChange={(e) => {
                    setLogPassword(e.target.value);
                  }}
                />
                <button
                  className={styles.eyeButton}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    className={styles.eyeIcon}
                    src={showPassword ? EyeOpenIcon : EyeClosedIcon}
                    alt="eye icon"
                  />
                </button>
              </div>
              <button
                onClick={handleLoginSubmit}
                disabled={!logEmail || !logPassword}
                className={styles.button}
              >
                Sign In
              </button>
            </div>

            <div className={styles.footerContainer}>
              <p className={styles.link}>
                <NavLink to="/forgotpassword">Forgot password? </NavLink>
              </p>
              <p className={styles.link} onClick={() => setisLogin(false)}>
                Request a new account
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.registerBoxContainer}>
            <h1>Shoe ERP+</h1>

            <div className={styles.registerFormContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Name"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={formData.email}
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                required
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              <div className={styles.passwordContainer}>
                <input
                  className={styles.passInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  className={styles.eyeButton}
                  onClick={togglePasswordVisibility}
                  type="button"
                >
                  <img
                    className={styles.eyeIcon}
                    src={showPassword ? EyeOpenIcon : EyeClosedIcon}
                    alt="eye icon"
                  />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.email ||
                  !formData.name ||
                  !formData.password ||
                  !formData.phoneNumber
                }
                className={styles.button}
              >
                Register
              </button>
            </div>

            <div className={styles.footerContainer}>
              <p className={styles.link}>
                <NavLink to="/forgotpassword">Forgot password? </NavLink>
              </p>
              <p className={styles.link} onClick={() => setisLogin(true)}>
                Already have an account?
              </p>
            </div>
            <div className={styles.validationPara}>
              <p className={styles.valid}>
                Password : Must have 8 digits , at least one small and <br />{" "}
                one capital alphabet , at least a nubmer and symbol
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.rightDiv}>
        <div className={styles.perfect}>Contact Perfect Software</div>
      </div>
    </div>
  );
};

export default LoginRegister;
