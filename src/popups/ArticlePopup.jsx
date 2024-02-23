import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import inputStyles from "../styles/inputDetails.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { fetchAllArticles } from "../reducer/articleSlice";
import { fetchAllArticleMst } from "../reducer/articleMstSlice";
import { useDispatch, useSelector } from "react-redux";
import { ARTICLE_IMAGE_PATH } from "../features/url";
import { getApiService , getDataApiService } from "../service/apiService";

const ArticlePopup = ({ onCancel, onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rowSelect, setRowSelect] = useState(false);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [adLoading,setAdLoading]= useState(false);
  const [articleDetails, setArticleDetails] = useState([]);
  const [isArticleDetails,setIsArticleDetails]= useState(false);
  const dispatch = useDispatch();
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);

  const { articleMst, loaded, loading, error } = useSelector(
    (state) => state.articleMst
  );

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllArticleMst());
    }
  }, [loaded, loading, dispatch]);
  
  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else if (error) {
        gridApi.showNoRowsOverlay();
      } else if (loaded && articleMst.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, loaded, loading, error, articleMst]);

  const togglePopup = (message) => {
    setIsErrorPopupVisible(!isErrorPopupVisible);
    setPopupMessage(message);
  };
  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      console.log(filterLocalDateAtMidnight);
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    },
  };


  const columnDefsMst = [
    { headerName: "Article No",  width:200, field: "article_no", sortable: true, filter: true },
    {
      headerName: "Last No",
      field: "last_no",
      sortable: true,
      width:200,
      filter: true,
    },
    {
      headerName: "Article Details",
      field:'articleMstId',
      width:200,
      cellRenderer: function (params) {
        return (
          <div style={{
            height: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center' 
          }}>
             {adLoading ? (
              <div className={inputStyles.buttonContainer}>
                <div className={inputStyles.loader}></div>
              </div>
            ) : (<button className={styles.viewButton}
              onClick={() => viewActionButton(params.value)}
             >
               View{" "}
             </button>)}
          </div>
        );
      },
    },

  ];


  const columnDefs = [
    { headerName: "Select", maxWidth: 80, checkboxSelection: true },
    { headerName: "Article No",  width:150, field: "articleName", sortable: true, filter: true },
    {
      headerName: "Last No",
      field: "lastNo",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Animal",
      field: "animal",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Image",
      field: "image_nm",
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        const imageUrl = `${ARTICLE_IMAGE_PATH}${params.value}`;
        return params.value ? (
          <img
            src={imageUrl}
            alt="Image"
            style={{ height: '50px', width: '50px' }}
            onClick={() => actionButton(params)}
          />
          ): 'No Image';
      },
    },
    {
      headerName: "Color",
      field: "color",
      sortable: true,
      width:130,
      filter: true,
    },
    { headerName: "Gender",  width:110, field: "gender", sortable: true, filter: true },
    {
      headerName: "Sole Type",
      field: "soleType",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Toe Shape",
      field: "toeShape",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Category",
      field: "category",
      sortable: true,
      width:130,
      filter: true,
    },
    {
      headerName: "Platform Type",
      field: "platformType",
      sortable: true,
      filter: true,
      width:150,
    },
    {
      headerName: "Platform No",
      field: "platformNo",
      sortable: true,
      width:150,
      filter: true,
    },
    {
      headerName: "Heel Type",
      field: "heelType",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Heel No",
      field: "heelNo",
      width:140,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Heel Height",
      field: "heelHeight",
      sortable: true,
      width:140,
      filter: true,
    },
    {
      headerName: "Lining Material",
      field: "liningMaterial",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Socks Material",
      field: "socksMaterial",
      sortable: true,
      width:160,
      filter: true,
    },
    {
      headerName: "Comment",
      field: "comment",
      sortable: true,
      width:250,
      filter: true,
    },
    {
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      width:150,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
 
  ];
  const actionButton = (params) => {
    setIsImagePopup(true);
    setImagePreview(params.data.image_nm)
  };

  const fetchArticleDetails = async (articleMstId) => {
    setAdLoading(true);
    try {
      if (articleMstId) {
        const BASE_URL = 'bom/getArticleWithArticleMstId';
        const response = await getDataApiService({ articleMstId: articleMstId }, BASE_URL);
        // const BASE_URL = 'article/getArticle';
        // const response = await getApiService(BASE_URL);
        console.log(response);
        setArticleDetails(response);
        setIsArticleDetails(true);
      }
    } catch (error) {
      togglePopup('Failed to fetch Related Articles')
      console.error(error);
    } finally {
      setAdLoading(false);
    }
  };
  const viewActionButton = async (params) => {
    console.log(params);
    fetchArticleDetails(params); 
  };
  const onCellKeyDown = useCallback((e) => {
    if (!e.event) {
      return;
    }
    const keyboardEvent = e.event;
    const key = keyboardEvent.key;
    if (key.length) {
      if (key === 'Enter') {
        var rowNode = e.node;
        var newSelection = !rowNode.isSelected();
        rowNode.setSelected(newSelection);
      }
    }
  }, []);
  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setRowSelect(selectedData.length > 0);
    setSelectedArticle(selectedData);

  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Article Directory</h1>
              <div style={{display:'flex' , alignItems:'center'}}>
              {isArticleDetails && <button className={styles.backViewButton}
               onClick={()=>setIsArticleDetails(false)}>
                 Go Back
              </button>}
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
            </div>
            <div
              className={`ag-theme-quartz ${styles.agThemeQuartz}`}
              style={{ height: 550, width: "100%", marginTop: "5px" }}
            >
              <AgGridReact
                 columnDefs={isArticleDetails ? columnDefs : columnDefsMst}
            rowData={isArticleDetails ? articleDetails : articleMst}
                pagination={true}
                paginationPageSize={12}
                paginationPageSizeSelector={[10, 12, 20, 50, 100]}
                animateRows={true}
                filter={true}
                onCellKeyDown={onCellKeyDown}
                onGridReady={onGridReady}
                onSelectionChanged={onRowSelected}
                overlayLoadingTemplate={
                  '<span class="ag-overlay-loading-center">Loading...</span>'
                }
                overlayNoRowsTemplate={
                  `<span class="ag-overlay-loading-center">${error ? 'Failed to load data' : 'No data found'}</span>`
                }
              />
            </div>
          </div>


          <div className={styles.bottomButtonContainer}>
            <h3>Couldn't find the Article ?</h3>
            <button
              className={styles.navigatePopupButton}
              onClick={() => navigate("/articledirectory")}
            >
              Add New Article
            </button>
            {isArticleDetails && <button
           disabled={!rowSelect}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitArticleData(selectedArticle);
              }}
            >
              Select
            </button>}
          </div>
        </div>
        {isImagePopup && (
        <div className={inputStyles.popupOverlay}>
          <div className={inputStyles.imagePopupContent}>
            <img
              src={`${ARTICLE_IMAGE_PATH}${imagePreview}`}
              className={inputStyles.imagepreviewPopup}
              alt=""
            />
            <img
              onClick={() => {
                setIsImagePopup(false);
              }}
              src={Cross}
              alt="Select Icon"
              className={inputStyles.crossIcon}
            />
          </div>
        </div>
      )}
     {isErrorPopupVisible && (
            <div className={inputStyles.popupOverlay}>
              <div className={inputStyles.popupContent}>
                <h2>{popupMessage}</h2>
                <button
                  className={inputStyles.popupButton}
                  onClick={()=>togglePopup()}
                >
                  OK
                </button>
              </div>
            </div>
          )}

      </div>
      
    )
  );
};

export default ArticlePopup;
