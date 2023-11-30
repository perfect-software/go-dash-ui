import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/articlePopup.module.css";
import TickCheck from "../assets/tickCheck.svg";
import axios from "axios";
import BlueCheck from "../assets/blueTick.svg";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
import { getApiService } from "../service/apiService";
const ArticlePopup = ({ onCancel, onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc"); // or 'desc'
  const [articles, setArticles] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedArticle, setselectedArticle] = useState(null);
  const [articleSearch, setArticleSearch] = useState({
    articleName: "",
    articleNo: "",
  });

  const callApi = async (page = 1) => {
    const adjustedPage = page - 1;
    const BASE_URL = `http://localhost:8081/api/article/view?page_num=${adjustedPage}`;
    try {
      const response = await axios.get(BASE_URL);
      const fetchedArticle = response.data;
      setArticles(fetchedArticle);
      setSelectedRowIndex(null);
      setselectedArticle(null);
    } catch (error) {
      console.error("Failed to fetch All articles:", error);
    }
  };
  const handleSort = (fieldName) => {
    const direction =
      fieldName === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(fieldName);
    setSortDirection(direction);

    const sortedArticles = [...articles].sort((a, b) => {
      if (a[fieldName] < b[fieldName]) return direction === "asc" ? -1 : 1;
      if (a[fieldName] > b[fieldName]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setArticles(sortedArticles);
  };
  const handleArticleNameSearch = async () => {
    if (articleSearch.articleName.length >= 3) {
      const BASE_URL = `article/getArticleName?input=${encodeURIComponent(
        articleSearch.articleName
      )}`;
      try {
        const fetchedArticles = await getApiService(BASE_URL);
        setArticles(fetchedArticles);
        setSelectedRowIndex(null);
        setselectedArticle(null);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    }
  };

  const handleArticleNoSearch = async () => {
    const BASE_URL = `article/getByArticleNo?input=${encodeURIComponent(
      articleSearch.articleNo
    )}`;
    try {
      const fetchedArticles = await getApiService(BASE_URL);
      setArticles(fetchedArticles);
      setSelectedRowIndex(null);
      setselectedArticle(null);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  const handleArticleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.length === 0) {
      callApi(1);
    }
    setArticleSearch({
      ...articleSearch,
      [name]: value,
    });
  };

  useEffect(() => {
    callApi(1);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const generateRow = (article, rowIndex) => (
    <tr
      key={rowIndex}
      onClick={() => {
        setSelectedRowIndex(rowIndex);
        setselectedArticle(article.articleId);
      }}
    >
      <td className={styles.selectColumn} style={{ textAlign: "center" }}>
        <button className={styles.selectButton}>
          <img
            src={selectedRowIndex === rowIndex ? BlueCheck : TickCheck}
            alt="Select Icon"
            className={styles.icon}
          />
        </button>
      </td>
      <td className={styles.articleContent}>{article.articleId}</td>
      <td className={styles.articleContent}>{article.articleName}</td>
      <td className={styles.articleContent}>{article.animal}</td>
      <td className={styles.articleContent}>{article.color}</td>
      <td className={styles.articleContent}>{article.gender}</td>
      <td className={styles.articleContent}>{article.soleType}</td>
      <td className={styles.articleContent}>{article.toeShape}</td>
      <td className={styles.articleContent}>{article.category}</td>
      <td className={styles.articleContent}>{article.platformType}</td>
      <td className={styles.articleContent}>{article.platformNo}</td>
      <td className={styles.articleContent}>{article.heelType}</td>
      <td className={styles.articleContent}>{article.heelNo}</td>
      <td className={styles.articleContent}>{article.heelHeight}</td>
      <td className={styles.articleContent}>{article.lastNo}</td>
      <td className={styles.articleContent}>{article.liningMaterial}</td>
      <td className={styles.articleContent}>{article.socksMaterial}</td>
      <td className={styles.articleContent}>{article.comment}</td>
      <td className={styles.articleContent}>{article.username}</td>
      <td className={styles.articleContent}>{article.entDate}</td>
    </tr>
  );
  const handleKeyDownName = (e) => {
    if (e.key === "Enter") {
      handleArticleNameSearch();
    }
  };

  const handleKeyDownNo = (e) => {
    if (e.key === "Enter") {
      handleArticleNoSearch();
    }
  };
  const renderTableRows = () => {
    return articles.map(generateRow);
  };

  const paginationRef = useRef(null);

  const renderPaginationControls = () => {
    const navigateTo = (page) => {
      if (page >= 1) {
        callApi(page);
        setCurrentPage(page);
      }
    };

    return (
      <div className={styles.parentPaginationControls}>
        <button
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <button className={styles.activePage}>{currentPage}</button>

        <button
          onClick={() => navigateTo(currentPage + 1)}
          disabled={articles.length < 10}
        >
          &gt;
        </button>

        <input
          type="number"
          placeholder="Go to page"
          style={{ width: "80px" }}
          min="1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              navigateTo(Number(e.target.value));
            }
          }}
        />
      </div>
    );
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.articlePopupContainer}>
          <div className={styles.toparticlePopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Article Directory</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
            <div className={styles.articleDropGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Article Name
                </label>

                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Type three letters"
                    className={styles.basicInput2}
                    onChange={handleArticleInputChange}
                    name="articleName"
                    onKeyDown={handleKeyDownName}
                  />
                  <button
                    onClick={handleArticleNameSearch}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Article No.
                </label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Type three letters"
                    className={styles.basicInput2}
                    onChange={handleArticleInputChange}
                    name="articleNo"
                    onKeyDown={handleKeyDownNo}
                  />
                  <button
                    onClick={handleArticleNoSearch}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div>
              </div>
              {/* <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input4">
                  Buyer No.
                </label>
                <div className={styles.selectWrapper}>
                  <select className={styles.selectInput} name="size">
                    <option value="" selected disabled hidden>
                      Select Buyer
                    </option>
                    <option value="11">11</option>
                    <option value="22">22</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>

          <div className={styles.bottomarticlePopupContainer}>
            <div className={styles.tablecontainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.selectColumn}>Select</th>
                    <th
                      className={styles.articleColumn}
                      onClick={() => handleSort("articleId")}
                    >
                      <div className={styles.flexContainer}>
                        Article Id
                        <button className={styles.sortButton}>
                          {sortField === "articleId"
                            ? sortDirection === "asc"
                              ? "↓"
                              : "↑"
                            : "↕"}
                        </button>
                      </div>
                    </th>
                    <th
                      className={styles.articleColumn}
                      onClick={() => handleSort("articleName")}
                    >
                      <div className={styles.flexContainer}>
                        Article Name
                        <button className={styles.sortButton}>
                          {sortField === "articleName"
                            ? sortDirection === "asc"
                              ? "↓"
                              : "↑"
                            : "↕"}
                        </button>
                      </div>
                    </th>
                    <th className={styles.articleColumn}>Animal</th>
                    <th className={styles.articleColumn}>Color</th>
                    <th className={styles.articleColumn}>Gender</th>
                    <th className={styles.articleColumn}>Sole Type</th>
                    <th className={styles.articleColumn}>Toe Shape</th>
                    <th className={styles.articleColumn}>Category</th>
                    <th className={styles.articleColumn}>Platform Type</th>
                    <th className={styles.articleColumn}>Platform No</th>
                    <th className={styles.articleColumn}>Heel Type</th>
                    <th className={styles.articleColumn}>Heel No</th>
                    <th className={styles.articleColumn}>Heel Height</th>
                    <th className={styles.articleColumn}>Last No</th>
                    <th className={styles.articleColumn}>Lining Material</th>
                    <th className={styles.articleColumn}>Socks Material</th>
                    <th className={styles.articleColumn}>Comment</th>
                    <th className={styles.articleColumn}>Username</th>
                    <th className={styles.articleColumn}>Entry Date</th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
          {renderPaginationControls()}
          <div className={styles.bottomarticleButtonContainer}>
            <h3>Couldn't find the Buyer ?</h3>
            <button
              className={styles.articlePopupButton}
              onClick={() => navigate("/articledirectory")}
            >
              Add New Buyer
            </button>
            <button
              disabled={selectedArticle == null}
              className={styles.articleSelectPopupButton}
              onClick={() => {
                onSubmitArticleData(selectedArticle);
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ArticlePopup;
