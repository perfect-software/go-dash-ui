import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import inputStyles from "../styles/inputDetails.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { ARTICLE_IMAGE_PATH } from "../features/url";
import { getApiService, getDataApiService } from "../service/apiService";

const ArticleDetailsPopup = ({ onCancel,articleMstId ,onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rowSelect, setRowSelect] = useState(false);
  const [articleDetails, setArticleDetails] = useState([]);
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [gridApi, setGridApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);
  
  
  useEffect(() => {
    if (gridApi) {
      if (isFetching) {
        gridApi.showLoadingOverlay();
      } else if (fetchError) {
        gridApi.showNoRowsOverlay();
      } else if (!isFetching && articleDetails.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        const rowDataToUpdate = [].concat(articleDetails);
        gridApi.updateGridOptions({ rowData: rowDataToUpdate });
        gridApi.hideOverlay();
      }
    }
    
  }, [gridApi, isFetching, fetchError, articleDetails]);
  

 const fetchArticleDetails = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      if (articleMstId) {
        const BASE_URL = 'bom/getArticleWithArticleMstId';
        const response = await getDataApiService({ articleMstId: articleMstId }, BASE_URL);
        // const BASE_URL = 'article/getArticle';
        // const response = await getApiService(BASE_URL);
        console.log(response);
        setArticleDetails(response); 
        setIsFetching(false);
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchArticleDetails();
  }, [articleMstId]); 



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
            <div
              className={`ag-theme-quartz ${styles.agThemeQuartz}`}
              style={{ height: 550, width: "100%", marginTop: "5px" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
               // rowData={articles}
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
                  `<span class="ag-overlay-loading-center">${fetchError ? 'Failed to load data' : 'No data found'}</span>`
                }
              />
            </div>
          </div>


          <div className={styles.bottomButtonContainer}>

            <button
           disabled={!rowSelect}
              className={styles.selectPopupButton}
              onClick={() => {
                onSubmitArticleData(selectedArticle);
              }}
            >
              Update
            </button>
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
      </div>
      
    )
  );
};

export default ArticleDetailsPopup;
